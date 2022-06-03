import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../Hooks/useFetch';
import { auth } from '../../../firebase.init';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../../Hooks/useMessage';

const ManageOrders = () => {
   const [user] = useAuthState(auth);
   const [seeMoreToggle, setSeeMoreToggle] = useState(0);
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`https://woo-com-serve.herokuapp.com/manage-orders/all`);
   const [newData, setNewData] = useState();

   useEffect(() => {
      let dd = true;
      dd && setNewData(data);
      return () => dd = false
   }, [data])

   if (loading) return <Spinner></Spinner>;
   const seeMoreToggleHandler = async (id) => id === seeMoreToggle ? setSeeMoreToggle(null) : setSeeMoreToggle(id);

   const cancelOrderHandler = async (orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${user?.email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         refetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   const updateOrderStatusHandler = async (id, email, status) => {
      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";
      if (window.confirm(confirmMsg)) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/update-order-status/${email}/${id}/${status}`, { method: "PUT" });
         if (response.ok) await response.json();
         refetch();
      }
   }

   const ordersFilterHandler = async (e) => {
      const response = await fetch(`https://woo-com-serve.herokuapp.com/manage-orders/${e}`);
      if (response.ok) {
         const resData = await response.json();
         setNewData(resData);
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <h3 className="py-4 text-center">
               All Orders
            </h3>
            <div className='mb-5'>
               <select name="filterVal" className='my-3' id="filterVal" onChange={(e) => ordersFilterHandler(e.target.value)}>
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="placed">Placed</option>
               </select>
               <p className='text-center'>{newData && newData.length > 0 ? "Total : " + newData.length + " Orders" : "No Orders Available"}</p>
               {
                  newData ? newData.map((odr, ind) => {
                     const { orders } = odr;
                     return (
                        <div className="card_default my-2" key={ind}>
                           <div className="card_description">
                              <div className="py-1 d-flex align-items-center flex-wrap justify-content-between">
                                 <small className='text-dark py-2 mx-1'>OrderID : <i className='text-info'>#{orders?.orderId}</i></small>
                                 <small className='text-dark py-2 mx-1'>Total Amount : <i>{orders?.total_amount}$</i></small>
                                 <small className='text-dark py-2 mx-1'>Payment Mode : <i>{orders?.payment_mode}</i></small>
                                 <small className='text-dark py-2 mx-1'>Status : <i className='text-success'>{orders?.status}</i></small>
                                 <button disabled={odr?.status === "shipped" ? true : false} className="btn btn-sm btn-outline-primary"
                                    onClick={() => updateOrderStatusHandler(orders?.orderId, orders?.user_email, orders?.status === "pending" ? "placed" : "shipped")}>
                                    {orders?.status === "pending" ? "Placed" : "Shipped"}
                                 </button>
                                 <button className='btn btn-sm btn-danger ms-3' onClick={() => cancelOrderHandler(orders?.orderId)}>Cancel</button>
                              </div>

                              <button className='btn btn-sm' onClick={() => seeMoreToggleHandler(orders?.orderId)}>{seeMoreToggle === orders?.orderId ? "Hide" : "Show Order Items"}</button>
                              <div className='order_table' style={seeMoreToggle === orders?.orderId ? { display: "block" } : { display: "none" }}>
                                 <p className='py-2'>Customer Email : {orders?.user_email}</p>
                                 <Table striped responsive>
                                    <thead>
                                       <tr>
                                          <th>Product</th>
                                          <th>Name</th>
                                          <th>Price</th>
                                          <th>Order Qty</th>
                                          <th>Final Price</th>
                                          <th>Discount</th>
                                          <th>Payment Mode</th>
                                          <th>Status</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {
                                          orders && orders?.product.map((product) => {
                                             const { _id, product_name, price, image, quantity, final_price, discount } = product;
                                             return (
                                                <tr key={_id}>
                                                   <td>
                                                      {
                                                         <img src={image} style={{ width: "55px", height: "55px" }} alt="product_image" />
                                                      }
                                                   </td>
                                                   <td><Link to={`/product/${_id}`}>{product_name.length > 20 ? product_name.slice(0, 20) + "..." : product_name}</Link></td>
                                                   <td>{price}</td>
                                                   <td>{quantity}</td>
                                                   <td>{final_price}</td>
                                                   <td>{discount}%</td>
                                                   <td>{orders?.payment_mode}</td>
                                                   <td>{orders?.status}</td>
                                                </tr>
                                             )
                                          })
                                       }
                                    </tbody>
                                 </Table>
                              </div>
                           </div>
                        </div>
                     )
                  }) : ''
               }
            </div>
         </div>
      </div >
   );
};

export default ManageOrders;
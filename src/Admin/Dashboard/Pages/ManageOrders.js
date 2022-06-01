import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../Hooks/useFetch';
import { auth } from '../../../firebase.init';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../../Hooks/useMessage';

const ManageOrders = () => {
   const [user] = useAuthState(auth);
   const [p, setP] = useState(0);
   const [showAll, setShowALl] = useState(0);
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`https://woo-com-serve.herokuapp.com/all-orders`);

   if (loading) {
      return <Spinner></Spinner>;
   }

   const showHandler = async (id) => {
      if (id === p) {
         setP(null);
      } else {
         setP(id);
      }
   }

   const showAllOrders = (index) => {

      if (index === showAll) {
         setShowALl(null);
      } else {
         setShowALl(index);
      }
   }

   console.log(showAll);

   const cancelOrderHandler = async (orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${user?.email}/${orderId}`, {
            method: "DELETE"
         });
         if (response.ok) {
            const resData = await response.json();
            refetch();
            setMessage(<strong className='text-success'>Order Cancelled...</strong>);
         }
      }
   }

   const setOrderPlaced = async (id, email, status) => {

      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";

      if (window.confirm(confirmMsg)) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/update-order-status/${email}/${id}/${status}`, {
            method: "PUT"

         });

         if (response.ok) {
            const resData = await response.json();
            console.log(resData);
            refetch();
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <h3 className="py-4 text-center">
               All Orders
            </h3>
            <p className='text-center'>{data && data.length > 0 ? "Total : " + data.length + " Orders" : "You Have No Orders In Your History"}</p>
            <div className="row">
               {
                  data.length > 0 ? data.map((order, index) => {
                     return (
                        <div className="col-12 mb-3" key={order?._id}>
                           <div className="card_default">

                              <div className="card_description">

                                 <p className='d-flex align-items-center justify-content-between'>
                                    Order Card For {order?.user_email}
                                    <button className='btn btn-sm' onClick={() => showAllOrders(index)}>{showAll === index ? "Hide" : "Show"}&nbsp;All Orders</button>
                                 </p>
                                 <article style={showAll === index ? { display: "block" } : { display: "none" }}>
                                    {
                                       order ? order?.orders.map(odr => {
                                          return (

                                             <div key={odr?.orderId} className='my-2 card_default'>
                                                <div className="card_description">
                                                   <div className="py-1 d-flex align-items-center flex-wrap justify-content-between">
                                                      <small className='text-dark py-2 mx-1'>OrderID : <i className='text-info'>#{odr?.orderId}</i></small>
                                                      <small className='text-dark py-2 mx-1'>Total Amount : <i>{odr?.total_amount}$</i></small>
                                                      <small className='text-dark py-2 mx-1'>Payment Mode : <i>{odr?.payment_mode}</i></small>
                                                      <small className='text-dark py-2 mx-1'>Status : <i className='text-success'>{odr?.status}</i></small>
                                                      <button disabled={odr?.status === "shipped" ? true : false} className="btn btn-sm btn-outline-primary"
                                                         onClick={() => setOrderPlaced(odr?.orderId, odr?.user_email, odr?.status === "pending" ? "placed" : "shipped")}>
                                                         {odr?.status === "pending" ? "Placed" : "Shipped"}
                                                      </button>
                                                      <button className='btn btn-sm btn-danger ms-3' onClick={() => cancelOrderHandler(odr?.orderId)}>Cancel</button>
                                                   </div>
                                                   <Table style={p === odr?.orderId ? { display: "block" } : { display: "none" }} striped responsive>

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
                                                            <th>Action</th>
                                                         </tr>
                                                      </thead>
                                                      <tbody>
                                                         {
                                                            odr?.product ? odr?.product.map((product) => {
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
                                                                     <td>{order?.payment_mode}</td>
                                                                     <td>{order?.status}</td>

                                                                  </tr>
                                                               )
                                                            }) : <tr><td>No Orders Found</td></tr>
                                                         }
                                                      </tbody>
                                                   </Table>
                                                </div>
                                                <button className='btn btn-sm' onClick={() => showHandler(odr?.orderId)}>{p === odr?.orderId ? "Hide" : "Show Order Items"}</button>

                                             </div>
                                          )
                                       }) : ''
                                    }


                                 </article>
                              </div>
                           </div>
                        </div>
                     )
                  }) : ""
               }
            </div>
         </div>
      </div >
   );
};

export default ManageOrders;
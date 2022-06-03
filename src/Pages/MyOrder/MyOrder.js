import React, { useState } from 'react';
import { useFetch } from '../../Hooks/useFetch';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { Table } from 'react-bootstrap';
import { useMessage } from '../../Hooks/useMessage';
import { Link } from 'react-router-dom';

const MyOrder = () => {
   const [user] = useAuthState(auth);
   const [p, setP] = useState(0);
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`https://woo-com-serve.herokuapp.com/my-order/${user?.email}`);

   if (loading) return <Spinner></Spinner>;

   const showHandler = async (id) => {
      if (id === p) {
         setP(null);
      } else {
         setP(id);
      }
   }

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


   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <h3 className="py-4 text-center">
               My All Orders
            </h3>
            <p className='text-center'>{data?.orders && data?.orders.length > 0 ? "Total : " + data?.orders.length + " Orders" : "You Have No Orders In Your History"}</p>
            <div className="row">
               {
                  data?.orders ? data?.orders.map(order => {
                     return (
                        <div className="col-12 mb-3" key={order?.orderId}>
                           <div className="card_default">

                              <div className="card_description">
                                 <div className="d-flex align-items-center justify-content-between flex-wrap">
                                    <small className='text-dark'>OrderID : <i className='text-info'>#{order?.orderId}</i></small>
                                    <small>Total Amount : {order?.total_amount}$</small>
                                    <small className='text-dark py-2 mx-1'>Payment Mode : <i>{order?.payment_mode}</i></small>
                                    <small className='text-dark py-2 mx-1'>Status : <i className='text-success'>{order?.status}</i></small>
                                    <button className='badge bg-danger ms-3' onClick={() => cancelOrderHandler(order?.orderId)}>Cancel</button>
                                 </div>


                                 <article>
                                    <button className='btn btn-sm' onClick={() => showHandler(order?.orderId)}>{p === order?.orderId ? "Hide" : "See"}&nbsp;Order Items</button>
                                    <Table style={p === order?.orderId ? { display: "block" } : { display: "none" }} striped responsive>
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
                                             order ? order?.product.map((product) => {
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

export default MyOrder;
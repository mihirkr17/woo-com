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
   const { data: rating, refetch: ratingRefetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-review/${user?.email}`);
   const [rat, setRating] = useState();

   const url = `https://woo-com-serve.herokuapp.com/add-rating/:pId`;

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

   const findRating = rating && rating.map(items => items?.rating?.rating_id);

   const ratingHandler = async (e) => {
      e.preventDefault();
      let ratingPoint = e.target.rating_point.value;
      let ratingDesc = e.target.rating_description.value;
      let productId = e.target.product_id.value;
      let userEmail = user?.email;
      let orderId = e.target.order_id.value;
      let ratingId = productId.slice(-6) + orderId;


      let rating = {
         product_id: productId,
         rating_customer: userEmail,
         rating_point: ratingPoint,
         rating_description: ratingDesc,
         rating_id: ratingId
      }

      const response = await fetch(`https://woo-com-serve.herokuapp.com/add-rating/${userEmail}`, {
         method: "PUT",
         headers: {
            "content-type": "application/json"
         },
         body: JSON.stringify(rating)
      })

      if (response.ok) {
         const resData = await response.json();
         ratingRefetch();
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
                                    {
                                       order?.status === "pending" ?
                                          <button className='badge bg-danger ms-3' onClick={() => cancelOrderHandler(order?.orderId)}>Cancel</button> :
                                          ""
                                    }

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
                                             <th>Total Price</th>
                                             <th>Discount</th>
                                             <th>Category</th>
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {
                                             order ? order?.product.map((product) => {
                                                const { _id, product_name, price, image, quantity, final_price, category, discount, total_price, total_discount } = product;

                                                return (
                                                   <tr key={_id}>
                                                      <td>
                                                         {
                                                            <img src={image} style={{ width: "55px", height: "55px" }} alt="product_image" />
                                                         }
                                                      </td>
                                                      <td><Link to={`/product/${_id}`}>{product_name}</Link></td>
                                                      <td>{price}</td>
                                                      <td>{quantity}</td>
                                                      <td>{final_price}</td>
                                                      <td>{total_price} - {total_discount}</td>
                                                      <td>{discount}%/{total_discount}$</td>
                                                      <td>{category}</td>
                                                      <td>
                                                         {findRating && findRating.includes(_id.slice(-6) + order?.orderId) ?
                                                            <Link to={'/'}>Review</Link> :
                                                            <form onSubmit={ratingHandler} className='d-flex flex-column'>
                                                               <input type="range" min={1} max={5} step={1} name='rating_point' />
                                                               <textarea type="text" name='rating_description' placeholder='Write a Review' />
                                                               <input type="hidden" defaultValue={_id} name='product_id' />
                                                               <input type="hidden" defaultValue={order?.orderId} name='order_id' />
                                                               <button className='status_btn'>Add Review</button>
                                                            </form>
                                                         }
                                                      </td>
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
                  }).reverse() : ""
               }
            </div>
         </div>
      </div >
   );
};

export default MyOrder;
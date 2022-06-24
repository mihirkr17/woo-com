import React, { useState } from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../lib/UserProvider';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';

const MyOrder = () => {
   const user = useAuthUser();
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`https://woo-com-serve.herokuapp.com/my-order/${user?.email}`);
   const { data: rating, refetch: ratingRefetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-review/${user?.email}`);
   const [actLoading, setActLoading] = useState(false);
   const [ratPoint, setRatPoint] = useState("5");

   if (loading) return <Spinner></Spinner>;

   const cancelOrderHandler = async (orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${user?.email}/${orderId}`, {
            method: "DELETE"
         });
         if (response.ok) {
            const resData = await response.json();
            resData && refetch();
            setMessage(<strong className='text-success'>{resData?.message}</strong>);
         }
      }
   }

   const findRating = rating && rating.map(items => items?.rating?.rating_id);

   const ratingHandler = async (e) => {
      e.preventDefault();
      setActLoading(true);
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
         setActLoading(false);
         const resData = await response.json();
         resData && ratingRefetch();
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
                  data && data.orders.map(order => {

                     return (
                        <div className="col-12 mb-3" key={order?.orderId}>
                           <div className="card_default">

                              <div className="card_description">
                                 <div className="d-flex align-items-center justify-content-between flex-wrap">
                                    <small className='text-dark'>OrderID : <i className='text-info'>#{order?.orderId}</i></small>
                                    <small>Total Amount : {order?.price_total}$</small>
                                    <small className='text-dark py-2 mx-1'>Payment Mode : <i>{order?.payment_mode}</i></small>
                                    <small className='text-dark py-2 mx-1'>Status : <i className='text-success'>{order?.status}</i></small>
                                    {
                                       order?.status === "pending" ?
                                          <button className='badge bg-danger ms-3' onClick={() => cancelOrderHandler(order?.orderId)}>Cancel Order</button> :
                                          ""
                                    }
                                 </div>
                                 <div className="d-flex align-items-center justify-content-center flex-wrap">

                                    <div className="col-lg-6">
                                       <div className="">
                                          <img src={order?.image} alt="" style={{ width: "50px", height: "50px" }} />
                                       </div>
                                    </div>

                                    <div className="col-lg-6">
                                       {
                                          order?.status === "shipped" ? <div className='d-flex align-items-center justify-content-end'>
                                             {findRating && findRating.includes(order?._id.slice(-6) + order?.orderId) ?
                                                <Link to={`/product/${order?._id}#rating`}>Review</Link> :
                                                <div className="text-center p-3">
                                                   <form onSubmit={ratingHandler} className='d-flex flex-column'>
                                                      <input type="text" disabled defaultValue={ratPoint} key={ratPoint} />
                                                      <input type="range" min={1} max={5} step={1} name='rating_point' className='my-2' onChange={(e) => setRatPoint(e.target.value, order?.orderId)} />
                                                      <textarea type="text" name='rating_description' className='form-control form-control-sm' placeholder='Write a Review' />
                                                      <input type="hidden" defaultValue={order?._id} name='product_id' />
                                                      <input type="hidden" defaultValue={order?.orderId} name='order_id' />
                                                      <button className='btn btn-sm btn-primary mt-2'>{actLoading === true ? <BtnSpinner text={"Adding Review..."}></BtnSpinner> : "Add Review"}</button>
                                                   </form>
                                                </div>
                                             }
                                          </div> : ""
                                       }
                                    </div>

                                 </div>

                              </div>
                           </div>
                        </div>
                     )
                  }).reverse()
               }
            </div>
         </div>
      </div >
   );
};

export default MyOrder;
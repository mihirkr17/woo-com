import React, { useState } from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import FilterOption from "../../Shared/FilterOption";
import { useEffect } from 'react';
import { authLogout } from '../../Shared/common';
import "./MyOrder.css";
import { useAuthContext } from '../../lib/AuthProvider';


const MyOrder = () => {
   const { userInfo } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`${process.env.REACT_APP_BASE_URL}api/order/my-order/${userInfo?.email}`);
   const [actLoading, setActLoading] = useState(false);
   const [ratPoint, setRatPoint] = useState("5");
   const [reason, setReason] = useState("");
   const [openCancelForm, setOpenCancelForm] = useState(false);
   const [openReviewForm, setOpenReviewForm] = useState(false);
   const [filterOrder, setFilterOrder] = useState("");
   const [orderItems, setOrderItems] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      if (filterOrder === "" || filterOrder === "all") {
         setOrderItems(data && data.orders)
      } else {
         setOrderItems(data && data.orders.filter(p => p?.status === filterOrder))
      }
   }, [data, filterOrder]);

   const openCancelFormHandler = (orderId) => {
      if (orderId === openCancelForm) {
         setOpenCancelForm(false);
      } else {
         setOpenCancelForm(orderId);
      }
   }

   const openReviewFormHandler = (orderId) => {
      if (orderId === openReviewForm) {
         setOpenReviewForm(false);
      } else {
         setOpenReviewForm(orderId);
      }
   }

   const removeOrderHandler = async (orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/order/remove-order/${userInfo?.email}/${orderId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
         });

         const resData = await response.json();
         if (response.ok) {
            resData && refetch();
            setMessage(<strong className='text-success'>{resData?.message}</strong>);
         } else {
            await authLogout();
            navigate(`/login?err=${resData?.error}`);
         }
      }
   }


   const ratingHandler = async (e) => {
      e.preventDefault();
      setActLoading(true);
      let ratingPoint = e.target.rating_point.value;
      let ratingDesc = e.target.rating_description.value;
      let productId = e.target.product_id.value;
      let orderId = e.target.order_id.value;
      let ratingId = Math.floor(Math.random() * 1000000);

      let review = {
         ratingId, orderId: parseInt(orderId), rating_customer: userInfo?.username, rating_point: ratingPoint, rating_description: ratingDesc
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/review/add-product-rating/${productId}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ ...review })
      });

      const resData = await response.json();

      if (response.ok) {
         setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
         setActLoading(false);
         refetch()
      }

      if (response.status === 401 || response.status === 403) {
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      }
   }

   const handleCancelOrder = async (e, quantity, productId) => {
      e.preventDefault();
      let cancel_reason = reason;
      let status = "canceled";
      let orderId = e.target.orderId.value;
      let userEmail = e.target.user_email.value;
      let time_canceled = new Date().toLocaleString();

      if (cancel_reason === "Choose Reason" || cancel_reason === "") {
         setMessage(<strong className='text-success'>Please Select Cancel Reason...</strong>);
         return;
      } else {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/order/cancel-my-order/${userEmail}/${orderId}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ status, cancel_reason, time_canceled, quantity, productId })
         });

         const resData = await response.json();

         if (response.ok) {
            refetch();
            setMessage(<strong className='text-success'>{resData?.message}</strong>);
         }

         if (response.status === 401 || response.status === 403) {
            await authLogout();
            navigate(`/login?err=${resData?.error}`);
         }
      }
   }

   if (loading) return <Spinner></Spinner>;
   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <h3 className="py-4 text-center">
               My All Orders
            </h3>

            <div className="row">
               <div className="col-lg-2">
                  <h5>Filters</h5>
                  <hr />
                  <strong>
                     Order Status
                  </strong>
                  <FilterOption
                     options={["all", "pending", "placed", "shipped", "canceled"]}
                     filterHandler={setFilterOrder}
                  />
               </div>
               <div className="col-lg-10">
                  <h6>{orderItems && orderItems.length > 0 ? "Total : " + orderItems.length + " Orders" : "You Have No Orders In Your History"}</h6>
                  <div className="row">
                     {
                        orderItems && orderItems.length > 0 ? orderItems.map(order => {

                           const { title, quantity, payment_mode, status, orderId, price,
                              totalAmount, image, productId, seller, cancel_reason, time_canceled,
                              time_pending, time_placed, time_shipped, isRating, slug } = order && order;
                           return (
                              <div className="col-12 mb-3" key={orderId}>
                                 <div className="order_card">

                                    <div className="">
                                       <div className="row">
                                          <div className="col-lg-1">
                                             <div className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                                <img src={image} alt="" style={{ width: "75px", height: "75px" }} />
                                             </div>
                                          </div>
                                          <div className="col-lg-11">
                                             <div className="row">
                                                <div className="col-lg-5">
                                                   <div>
                                                      {title && title.length > 30 ? title.slice(0, 30) + "..." : title} <br />
                                                      <pre className="text-muted">
                                                         Price        : {price} Tk<br />
                                                         Qty          : {quantity} <br />
                                                         Seller       : {seller} <br />
                                                         Payment Mode : {payment_mode}
                                                      </pre>
                                                   </div>
                                                </div>

                                                <div className="col-lg-3">
                                                   <p>
                                                      Amount : {totalAmount}&nbsp;Tk <br />
                                                   </p>
                                                </div>

                                                <div className="col-lg-4">
                                                   {
                                                      status === "canceled" && <>
                                                         <p>
                                                            <small className="text-muted">
                                                               {"Order Status : " + status} <br />
                                                               {"Reason : " + cancel_reason} <br />
                                                               {"Cancel Time : " + time_canceled}
                                                            </small>
                                                         </p>
                                                         <div className="text-end">
                                                            <button className='btn btn-sm text-uppercase text-muted' onClick={() => removeOrderHandler(orderId)}>Remove</button>
                                                         </div>
                                                      </>
                                                   }
                                                   {
                                                      status === "pending" ?
                                                         <>
                                                            <p>
                                                               <small className="text-muted">
                                                                  {"Order Status : "}<i className="text-success">{status}</i> <br />
                                                                  {"Order Time : " + time_pending}
                                                               </small>
                                                            </p>
                                                            <button className="btn btn-sm text-danger" onClick={() => openCancelFormHandler(orderId)} style={openCancelForm !== orderId ? { display: "block" } : { display: "none" }}>
                                                               Cancel Order
                                                            </button>
                                                            <div className="py-4" style={openCancelForm === orderId ? { display: "block" } : { display: "none" }}>
                                                               <form onSubmit={(e) => handleCancelOrder(e, quantity, productId)} >
                                                                  <label htmlFor="reason">Select Reason</label>
                                                                  <div className="form-group d-flex">

                                                                     <FilterOption
                                                                        options={[
                                                                           "Choose Reason",
                                                                           "I want to order a different product",
                                                                           "I am getting better price",
                                                                           "I want to re-order using promo code",
                                                                           "I placed the order by mistake"
                                                                        ]} filterHandler={setReason} />
                                                                     <input type="hidden" name="orderId" defaultValue={orderId} />
                                                                     <input type="hidden" name="user_email" defaultValue={data?.user_email} />
                                                                     <button type="submit" className="btn btn-sm btn-danger">Cancel</button>
                                                                  </div>
                                                               </form>
                                                               <button className='btn btn-sm' onClick={() => openCancelFormHandler(false)} style={openCancelForm === orderId ? { display: "block" } : { display: "none" }}>Back</button>
                                                            </div>
                                                         </> :
                                                         status === "placed" ? <p>
                                                            <small className="text-muted">
                                                               {"Order Status : "}<i className="text-success">{status}</i> <br />
                                                               {"Order Time : " + time_pending} <br />
                                                               {"Order Placed Time : " + time_placed}
                                                            </small>
                                                         </p> :
                                                            status === "shipped" ?
                                                               <>
                                                                  <p>
                                                                     <small className="text-muted">
                                                                        {"Order Status : "}<i className="text-success">{status}</i> <br />
                                                                        {"Order Time : " + time_pending} <br />
                                                                        {"Order Placed Time : " + time_placed} <br />
                                                                        {"Order Shipped Time : " + time_shipped}
                                                                     </small>
                                                                  </p>
                                                                  <div className='d-flex align-items-center justify-content-end' >
                                                                     {isRating ? <Link to={`/product/${slug}#rating`}>Review</Link> :
                                                                        <>
                                                                           <button className="btn btn-sm text-danger" onClick={() => openReviewFormHandler(orderId)} style={openReviewForm !== orderId ? { display: "block" } : { display: "none" }}>
                                                                              Add Review
                                                                           </button>
                                                                           <div className="text-center p-3" style={openReviewForm === orderId ? { display: "block" } : { display: "none" }}>
                                                                              <form onSubmit={ratingHandler} className='d-flex flex-column'>
                                                                                 <input type="text" disabled defaultValue={ratPoint} key={ratPoint} />
                                                                                 <input type="range" min={1} max={5} step={1} name='rating_point' className='my-2' onChange={(e) => setRatPoint(e.target.value, orderId)} />
                                                                                 <textarea type="text" name='rating_description' className='form-control form-control-sm' placeholder='Write a Review' />
                                                                                 <input type="hidden" defaultValue={productId} name='product_id' />
                                                                                 <input type="hidden" defaultValue={orderId} name='order_id' />
                                                                                 <button className='btn btn-sm btn-primary mt-2'>{actLoading === true ? <BtnSpinner text={"Adding Review..."}></BtnSpinner> : "Add Review"}</button>
                                                                              </form>
                                                                              <button className='btn btn-sm' onClick={() => openReviewFormHandler(false)} style={openReviewForm === orderId ? { display: "block" } : { display: "none" }}>Back</button>
                                                                           </div>
                                                                        </>

                                                                     }
                                                                  </div>
                                                               </> : ""
                                                   }
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )
                        }).reverse() : <p>No Orders Available</p>
                     }
                  </div>
               </div>
            </div>

         </div>
      </div >
   );
};

export default MyOrder;
import React, { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import Modal from './Components/Modal/Modal';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useEffect } from 'react';
import OrderTable from './Components/OrderTable';
import { useOrder } from '../../lib/OrderProvider';
import { loggedOut } from '../../Shared/common';
import { useNavigate } from 'react-router-dom';
import ModalLabel from './Components/ModalLabel/ModalLabel';
import { useAuthContext } from '../../lib/AuthProvider';

const ManageOrders = () => {
   const { userInfo } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const { order, orderRefetch, orderLoading } = useOrder();
   const [openModal, setOpenModal] = useState(false);
   const [labelModal, setLabelModal] = useState(false);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [dispatchOrder, setDispatchOrder] = useState([]);
   const [shipOrder, setShipOrder] = useState([]);
   const [showOrders, setShowOrders] = useState("pending");
   const navigate = useNavigate();


   // Filtering orders by status
   useEffect(() => {
      if (order) {
         setPendingOrders(order.filter(odr => odr?.orders?.status === "pending").reverse());
         setDispatchOrder(order.filter(odr => odr?.orders?.status === "dispatch").reverse())
         setShipOrder(order.filter(odr => odr?.orders?.status === "shipped").reverse());
      }
   }, [order]);

   // Cancel the order if any wrong 
   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/order/remove-order/${email}/${orderId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
         });

         const resData = await response.json();

         if (response.ok) {
            setMessage(<strong className='text-success'>Order Cancelled...</strong>);
            orderRefetch();
         } else {
            await loggedOut();
            navigate(`/login?err=${resData?.error}`);
         }
      }
   }

   // Update the order status by seller or admin
   // const updateOrderStatusHandler = async (userEmail, orderId, status, ownerCommission = 0, totalEarn = 0, productId, quantity, seller) => {

   //    let confirmMsg = status === "pending" ? "Want To Placed This Order" : "Want To Shipped This Order";
   //    let successMsg = status === "pending" ? "Order Successfully Placed" : "Order Successfully Shipped";

   //    let st = status === "pending" ? "placed" : status === "placed" ? "shipped" : "";

   //    if (window.confirm(confirmMsg)) {
   //       const response = await fetch(`${process.env.REACT_APP_BASE_URL}update-order-status/${st}/${orderId}`, {
   //          method: "PUT",
   //          withCredentials: true,
   //          credentials: "include",
   //          headers: {
   //             "Content-Type": "application/json",
   //             authorization: `${userEmail}`
   //          },
   //          body: JSON.stringify({ ownerCommission, totalEarn: parseFloat(totalEarn), productId, quantity, seller })
   //       });

   //       if (response.ok) {
   //          await response.json();
   //          setMessage(<p className='text-success'><small><strong>{successMsg}</strong></small></p>);
   //          orderRefetch();
   //       } else {
   //          await loggedOut();
   //          navigate(`/login?err=token not found`);
   //       }

   //    }
   // }

   const orderDispatchHandler = async (order) => {
      const { orderId, trackingId, user_email } = order;

      if (orderId && trackingId) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/order/dispatch-order-request/${orderId}/${trackingId}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: `${user_email}`
            }
         });

         const resData = await response.json();

         if (response.status >= 200 && response.status <= 299) {
            setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>)
            orderRefetch();
         }

         if (response.status === 401 || response.status === 403) {
            await loggedOut();
            navigate(`/login?err=${resData?.error}`);
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <h5 className="pb-1">
               All Orders
            </h5>
            {msg}
            <div className="headers">
               <button onClick={() => setShowOrders("pending")} className={`hBtn ${showOrders === "pending" ? "active" : ""}`}>
                  Pending Orders ({pendingOrders.length})
               </button>
               <button onClick={() => setShowOrders("process")} className={`hBtn ${showOrders === "process" ? "active" : ""}`}>
                  On Processing ({dispatchOrder.length})
               </button>
               <button onClick={() => setShowOrders("shipped")} className={`hBtn ${showOrders === "shipped" ? "active" : ""}`}>
                  Shipped
               </button>
            </div>
            <div className="row">
               {
                  showOrders === "pending" &&
                  <div className="col-lg-12 mb-4 p-3">
                     <div className="card_default card_description">
                        <div className="py-1">
                           {
                              orderLoading ? <Spinner /> : pendingOrders.length > 0 ?
                                 <OrderTable
                                    orderList={pendingOrders}
                                    orderDispatchHandler={orderDispatchHandler}
                                    cancelOrderHandler={cancelOrderHandler}
                                    setOpenModal={setOpenModal}
                                    setLabelModal={setLabelModal}
                                 /> : <i className='text-muted'>No pending orders</i>
                           }
                        </div>
                     </div>
                  </div>
               }

               {
                  showOrders === "process" &&
                  <div className="col-lg-12  mb-4 p-3">
                     <div className='card_default card_description'>
                        {
                           dispatchOrder.length > 0 ? <>
                              <h6>Ready To Ship ({dispatchOrder.length})</h6>
                              <div className="py-1">
                                 <OrderTable
                                    orderList={dispatchOrder}
                                    setOpenModal={setOpenModal}
                                 />
                              </div>
                           </> : "No orders"

                        }

                     </div>
                  </div>
               }

               {showOrders === "shipped" && <div className="col-lg-12">
                  <div className="card_default card_description">
                     <h6>Shipped Orders ({shipOrder.length})</h6>
                     <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {
                           orderLoading ? <Spinner /> : shipOrder.length > 0 ?
                              <OrderTable
                                 orderList={shipOrder}
                                 setOpenModal={setOpenModal}
                              /> : <i className='text-muted'>No shipped orders</i>
                        }
                     </div>
                  </div>
               </div>
               }
            </div>
         </div>
         {
            openModal && <Modal
               data={openModal}
               closeModal={() => setOpenModal(false)}
            ></Modal>
         }

         {labelModal && <ModalLabel
            data={labelModal}
            userInfo={userInfo}
            closeModal={() => setLabelModal(false)}
         ></ModalLabel>
         }
      </div >
   );
};

export default ManageOrders;
import React, { useState } from 'react';
import OrderDetailsModal from './Components/OrderDetailsModal';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useEffect } from 'react';
import OrderTable from './Components/OrderTable';
import { useOrder } from '../../../lib/OrderProvider';
import OrderLabelModal from './Components/OrderLabelModal';
import { useAuthContext } from '../../../lib/AuthProvider';
import { useMessage } from '../../../Hooks/useMessage';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrin, faGrip, faGripHorizontal, faGripLinesVertical, faHamburger, faList } from '@fortawesome/free-solid-svg-icons';


const ManageOrders = () => {
   const { userInfo } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const { order, orderRefetch, orderLoading, viewController } = useOrder();
   const [openModal, setOpenModal] = useState(false);
   const [labelModal, setLabelModal] = useState(false);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [dispatchOrder, setDispatchOrder] = useState([]);
   const [shipOrder, setShipOrder] = useState([]);
   const [showOrders, setShowOrders] = useState("pending");
   const navigate = useNavigate();

   const viewMode = new URLSearchParams(window.location.search).get("view");
   // Filtering orders by status
   useEffect(() => {
      if (order) {
         setPendingOrders(order.filter(odr => odr?.orderStatus === "pending").reverse());
         setDispatchOrder(order.filter(odr => odr?.orderStatus === "dispatch").reverse())
         setShipOrder(order.filter(odr => odr?.orderStatus === "shipped").reverse());
      }
   }, [order]);

   // Cancel the order if any wrong 
   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/remove-order/${email}/${orderId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
         });

         const resData = await response.json();

         if (response.ok) {
            setMessage(resData?.message, "success");
            orderRefetch();
         }
      }
   }

   const orderDispatchHandler = async (order) => {
      try {
         const { orderID, trackingID, customerEmail } = order;

         if (orderID && trackingID && customerEmail) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/store/${userInfo?.seller?.storeInfos?.storeName}/order/dispatch-order`, {
               method: "PUT",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ context: { MARKET_PLACE: "WooKart" }, module: { orderID, trackingID, customerEmail } })
            });

            const resData = await response.json();

            if (response.status >= 200 && response.status <= 299) {
               setMessage(resData?.message, "success")
               orderRefetch();
            } else {
               setMessage(resData?.message, "danger");
            }
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   function view(params) {
      viewController(params);
      navigate('.?view=' + params);
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

            <div className="py-2">
               View As : <button className='bt9_edit' onClick={() => view("group")}>
                  Group
               </button>
               &nbsp;
               <button className='bt9_edit' onClick={() => view("single")}>
                  Single List
               </button>
            </div>

            <div className="row">
               {
                  viewMode === "group" ?
                     Array.isArray(order) && order.map(og => {
                        return (
                           <div className="col-lg-12" style={{ border: "1px solid black", margin: "0 0 1rem 0" }} key={og?._id}>
                              <p>
                                 Order Payment ID: {og?._id} <br />
                                 Total Order Amount: {og?.totalOrderAmount}
                              </p>
                              <OrderTable
                                 orderList={Array.isArray(og?.orders) && og?.orders}
                                 orderDispatchHandler={orderDispatchHandler}
                                 cancelOrderHandler={cancelOrderHandler}
                                 setOpenModal={setOpenModal}
                                 setLabelModal={setLabelModal}

                              />
                           </div>
                        )
                     }) : <>
                        {
                           showOrders === "pending" &&
                           <div className="col-lg-12 mb-4 p-3">
                              <div className="card_default card_description">
                                 <div className="py-1">
                                    {
                                       orderLoading ? <Spinner /> : pendingOrders.length > 0 ?
                                          <OrderTable
                                             orderRefetch={orderRefetch}
                                             orderList={order}
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
                     </>
               }
            </div>

            <div className="row">

            </div>
         </div>
         {
            openModal && <OrderDetailsModal
               data={openModal}
               closeModal={() => setOpenModal(false)}
            ></OrderDetailsModal>
         }

         {labelModal && <OrderLabelModal
            data={labelModal}
            userInfo={userInfo}
            closeModal={() => setLabelModal(false)}
         ></OrderLabelModal>
         }
      </div >
   );
};

export default ManageOrders;
import React, { useState } from 'react';
import OrderDetailsModal from './Components/OrderDetailsModal';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useEffect } from 'react';
import OrderTable from './Components/OrderTable';
import { useOrder } from '../../../lib/OrderProvider';
import OrderLabelModal from './Components/OrderLabelModal';
import { useAuthContext } from '../../../lib/AuthProvider';
import { useNavigate } from 'react-router-dom';
import OrderPaymentInfoModal from './Components/OrderPaymentInfoModal';


const ManageOrders = () => {
   const { userInfo, setMessage } = useAuthContext();
   const { order, orderRefetch, orderLoading, viewController } = useOrder();
   const [openModal, setOpenModal] = useState(false);
   const [openOrderPaymentInfo, setOpenOrderPaymentInfo] = useState(false);
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
                     Array.isArray(order) && order.map((og, index) => {

                        return (
                           <div className="col-lg-12" style={{ border: "1px solid black", margin: "0 0 1rem 0", minHeight: "200px" }} key={index}>
                              <small>
                                 <pre>
                                    Order Payment ID     : {og?._id} <br />
                                    Total Payment Amount : {og?.totalOrderAmount}
                                 </pre>
                              </small>

                              <OrderTable
                                 orderList={Array.isArray(og?.orders) && og?.orders}
                                 setOpenModal={setOpenModal}
                                 setLabelModal={setLabelModal}
                                 setOpenOrderPaymentInfo={setOpenOrderPaymentInfo}
                                 orderRefetch={orderRefetch}
                                 setMessage={setMessage}
                                 userInfo={userInfo}
                              />
                           </div>
                        )
                     }) : <>
                        {
                           <div className="col-lg-12 mb-4 p-3">
                              <div className="card_default card_description">
                                 <div className="py-1">
                                    {
                                       orderLoading ? <Spinner /> :
                                          <OrderTable
                                             setMessage={setMessage}
                                             orderRefetch={orderRefetch}
                                             orderList={order}
                                             setOpenModal={setOpenModal}
                                             setLabelModal={setLabelModal}
                                             setOpenOrderPaymentInfo={setOpenOrderPaymentInfo}
                                             userInfo={userInfo}
                                          /> 
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
         </div>

         {
            openOrderPaymentInfo && <OrderPaymentInfoModal
               orderRefetch={orderRefetch}
               data={openOrderPaymentInfo}
               closeModal={() => setOpenOrderPaymentInfo(false)}
            />
         }

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
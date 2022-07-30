import React, { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import Modal from './Components/Modal/Modal';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useAuthUser } from '../../lib/UserProvider';
import { useEffect } from 'react';
import OrderTable from './Components/OrderTable';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useOrder } from '../../App';

const ManageOrders = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { msg, setMessage } = useMessage();
   const { order, orderRefetch, orderLoading } = useOrder();

   const [openModal, setOpenModal] = useState(false);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [placeOrder, setPlaceOrder] = useState([]);
   const [shipOrder, setShipOrder] = useState([]);

   // Filtering orders by status
   useEffect(() => {
      if (order) {
         setPendingOrders(order.filter(odr => odr?.orders?.status === "pending").reverse());
         setPlaceOrder(order.filter(odr => odr?.orders?.status === "placed").reverse())
         setShipOrder(order.filter(odr => odr?.orders?.status === "shipped").reverse());
      }
   }, [order]);

   // Cancel the order if any wrong 
   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${BASE_URL}api/remove-order/${user?.email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         orderRefetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   // Update the order status by seller or admin
   const updateOrderStatusHandler = async (userEmail, orderId, status, ownerCommission = 0, totalEarn = 0, productId, quantity, seller) => {

      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";
      let successMsg = status === "placed" ? "Order Successfully Placed" : "Order Successfully Shipped";

      let st = status === "pending" ? "placed" : status === "placed" ? "shipped" : "";

      if (window.confirm(confirmMsg)) {
         const response = await fetch(`${BASE_URL}update-order-status/${st}/${userEmail}/${orderId}`, {
            method: "PUT",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({ ownerCommission, totalEarn : parseFloat(totalEarn), productId, quantity, seller })
         });
         if (response.ok) await response.json();
         setMessage(<p className='text-success'><small><strong>{successMsg}</strong></small></p>);
         orderRefetch();
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <h5 className="pb-1">
               All Orders
            </h5>
            {msg}
            <div className="row">
               <div className="col-lg-12 mb-4 p-3">
                  <div className="card_default card_description">
                     <h6>Pending Orders ({pendingOrders.length})</h6>
                     <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {
                           orderLoading ? <Spinner /> : pendingOrders.length > 0 ?
                              <OrderTable
                                 orderList={pendingOrders}
                                 updateOrderStatusHandler={updateOrderStatusHandler}
                                 cancelOrderHandler={cancelOrderHandler}
                                 setOpenModal={setOpenModal}
                              /> : <i className='text-muted'>No pending orders</i>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-12  mb-4 p-3">
                  <div className='card_default card_description'>
                     <h6>Placed Orders ({placeOrder.length})</h6>
                     <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {
                           orderLoading ? <Spinner /> : placeOrder.length > 0 ?
                              <OrderTable
                                 orderList={placeOrder}
                                 updateOrderStatusHandler={updateOrderStatusHandler}
                                 setOpenModal={setOpenModal}
                              />
                              : <i className='text-muted'>No placed orders</i>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-12">
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
            </div>
         </div>
         <Modal
            data={openModal}
            closeModal={() => setOpenModal(false)}
         ></Modal>
      </div >
   );
};

export default ManageOrders;
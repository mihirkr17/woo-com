import React, { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import Modal from './Components/Modal/Modal';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useAuthUser } from '../../lib/UserProvider';
import { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
import OrderTable from './Components/OrderTable';
import { useBASE_URL } from '../../lib/BaseUrlProvider';

const ManageOrders = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { role } = useAuth(user);
   const { msg, setMessage } = useMessage();

   let url = role === "admin" ? `${BASE_URL}manage-orders?email=${user?.email}` :
      `${BASE_URL}manage-orders`;

   const { data, refetch, loading } = useFetch(url);
   const [openModal, setOpenModal] = useState(false);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [placeOrder, setPlaceOrder] = useState([]);
   const [shipOrder, setShipOrder] = useState([]);

   // Filtering orders by status
   useEffect(() => {
      if (data) {
         setPendingOrders(data.filter(odr => odr?.orders?.status === "pending").reverse());
         setPlaceOrder(data.filter(odr => odr?.orders?.status === "placed").reverse())
         setShipOrder(data.filter(odr => odr?.orders?.status === "shipped").reverse());
      }
   }, [data]);

   // Cancel the order if any wrong 
   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${BASE_URL + email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         refetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   // Update the order status by seller or admin
   const updateOrderStatusHandler = async (userEmail, orderId, status, ownerCommission = 0, totalEarn = 0) => {

      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";
      let successMsg = status === "placed" ? "Order Successfully Placed" : "Order Successfully Shipped";

      let st = status === "pending" ? "placed" : status === "placed" ? "shipped" : "";

      if (window.confirm(confirmMsg)) {
         const response = await fetch(`${BASE_URL}update-order-status/${st}/${userEmail}/${orderId}`, {
            method: "PUT",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({ ownerCommission, totalEarn, seller_email: user?.email })
         });
         if (response.ok) await response.json();
         setMessage(<p className='text-success'><small><strong>{successMsg}</strong></small></p>);
         refetch();
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
                           loading ? <Spinner /> : pendingOrders.length > 0 ?
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
                           loading ? <Spinner /> : placeOrder.length > 0 ?
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
                           loading ? <Spinner /> : shipOrder.length > 0 ?
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
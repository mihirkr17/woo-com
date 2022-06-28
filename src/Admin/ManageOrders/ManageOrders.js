import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useMessage } from '../../Hooks/useMessage';
import Modal from '../../Components/Modal/Modal';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useAuthUser } from '../../lib/UserProvider';
import { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';

const ManageOrders = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const { msg, setMessage } = useMessage();
   const [url, setUrl] = useState("");
   const { data, refetch, loading } = useFetch(url);
   const [openModal, setOpenModal] = useState(false);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [placeOrder, setPlaceOrder] = useState([]);
   const [shipOrder, setShipOrder] = useState([]);

   useEffect(() => {
      if (role) {
         setUrl(
            role === "admin" ? `https://woo-com-serve.herokuapp.com/manage-orders?email=${user?.email}` :
               `https://woo-com-serve.herokuapp.com/manage-orders`
         )
      }
   }, [role, user?.email]);

   useEffect(() => {
      if (data) {
         setPendingOrders(data.filter(odr => odr?.orders?.status === "pending").reverse());
         setPlaceOrder(data.filter(odr => odr?.orders?.status === "placed").reverse())
         setShipOrder(data.filter(odr => odr?.orders?.status === "shipped").reverse());
      }
   }, [data]);


   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         refetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   const updateOrderStatusHandler = async (uEmail, id, status, ownerCommission = 0, totalEarn = 0) => {

      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";

      let url = `https://woo-com-serve.herokuapp.com/update-order-status/${status}/${uEmail}/${id}`;

      if (window.confirm(confirmMsg)) {
         const response = await fetch(url, {
            method: "PUT",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({ ownerCommission, totalEarn, seller_email: user?.email })
         });
         if (response.ok) await response.json();
         refetch();
      }
   }

   if (loading) return <Spinner></Spinner>;
   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <h3 className="py-4 text-center">
               All Orders
            </h3>
            <div className="row">
               <div className="col-lg-12 mb-4 p-3">

                  <div className="card_default card_description">
                     <h6>Pending Orders {pendingOrders.length}</h6>
                     <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {
                           pendingOrders.length > 0 ?
                              <Table striped responsive>
                                 <thead>
                                    <tr>
                                       <th>Order Id</th>
                                       <th>Customer Email</th>
                                       <th>Mode</th>
                                       <th>Amount</th>
                                       <th>Status</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {
                                       pendingOrders && pendingOrders.map((odr) => {
                                          const { orderId, user_email, payment_mode, price_total, status, owner_commission } = odr?.orders;
                                          return (
                                             <tr key={orderId}>
                                                <td># <span className="text-info">{orderId}</span> </td>
                                                <td>{user_email}</td>
                                                <td>{payment_mode}</td>
                                                <td>{price_total}$</td>
                                                <td>{status}</td>
                                                <td>{
                                                   <button disabled={status === "shipped" ? true : false} className="status_btn"
                                                      onClick={() => updateOrderStatusHandler(
                                                         user_email,
                                                         orderId,
                                                         "placed"
                                                      )}>
                                                      Place
                                                   </button>
                                                }</td>
                                                <td>
                                                   <button className="status_btn" onClick={() => setOpenModal(true && odr?.orders)}>Details</button>
                                                </td>
                                                <td>
                                                   <button className='badge bg-danger' onClick={() => cancelOrderHandler(user_email, orderId)}>Cancel Order</button>
                                                </td>
                                             </tr>
                                          )
                                       })
                                    }
                                 </tbody>
                              </Table>
                              :
                              <p>No pending orders</p>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-12  mb-4 p-3">

                  <div className='card_default card_description'>
                     <h6>Placed Orders {placeOrder.length}</h6>
                     <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {
                           placeOrder.length > 0 ?

                              <Table striped responsive>
                                 <thead>
                                    <tr>
                                       <th>Order Id</th>
                                       <th>Customer Email</th>
                                       <th>Mode</th>
                                       <th>Amount</th>
                                       <th>Status</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {
                                       placeOrder && placeOrder.map((odr) => {
                                          const { orderId, user_email, payment_mode, price_total, status, owner_commission, discount_amount_total, quantity } = odr?.orders;
                                          let discount = parseFloat(discount_amount_total);
                                          let priceTotal = parseFloat(price_total) - discount;
                                          let total_earn = priceTotal - parseFloat(owner_commission)
                                          return (
                                             <tr key={orderId}>
                                                <td># <span className="text-info">{orderId}</span> </td>
                                                <td>{user_email}</td>
                                                <td>{payment_mode}</td>
                                                <td>{price_total}$</td>
                                                <td>{status}</td>
                                                <td>{
                                                   <button disabled={status === "shipped" ? true : false} className="status_btn"
                                                      onClick={() => updateOrderStatusHandler(
                                                         user_email,
                                                         orderId,
                                                         "shipped",
                                                         parseFloat(owner_commission.toFixed(2)),
                                                         parseFloat(total_earn.toFixed(2))
                                                      )}>
                                                      Ship
                                                   </button>
                                                }</td>
                                                <td>
                                                   <button className="status_btn" onClick={() => setOpenModal(true && odr?.orders)}>Details</button>
                                                </td>
                                             </tr>
                                          )
                                       })
                                    }
                                 </tbody>
                              </Table> :
                              <p>No placed orders</p>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-12 card_default card_description">
                  <h6>All Shipped Orders</h6>
                  <h6>Total Sell : {shipOrder.length}&nbsp;Products</h6>
                  <div className="py-1" style={{ maxHeight: "300px", overflowY: "auto" }}>
                     {
                        shipOrder.length >= 0 ?
                           <Table striped responsive>
                              <thead>
                                 <tr>
                                    <th>Order Id</th>
                                    <th>Customer Email</th>
                                    <th>Payment Mode</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    shipOrder && shipOrder.map((odr, ind) => {
                                       const { orderId, user_email, payment_mode, price_total, status } = odr?.orders;
                                       return (
                                          <tr key={orderId}>
                                             <td># <span className="text-info">{orderId}</span> </td>
                                             <td>{user_email}</td>
                                             <td>{payment_mode}</td>
                                             <td>{price_total}$</td>
                                             <td>{status}</td>
                                             <td>
                                                <button className="status_btn" onClick={() => setOpenModal(true && odr?.orders)}>Details</button>
                                             </td>
                                          </tr>
                                       )
                                    })
                                 }
                              </tbody>
                           </Table> :
                           <p>No shipped orders</p>
                     }
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
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

   useEffect(() => {
      if (role) {
         setUrl(
            role === "admin" ? `https://woo-com-serve.herokuapp.com/manage-orders?email=${user?.email}` :
               `https://woo-com-serve.herokuapp.com/manage-orders`
         )
      }
   }, [role, user?.email]);

   if (loading) return <Spinner></Spinner>;

   const cancelOrderHandler = async (email, orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         refetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   const updateOrderStatusHandler = async (uEmail, id, status) => {

      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";
      if (window.confirm(confirmMsg)) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/update-order-status/${status}/${uEmail}/${id}`, { method: "PUT" });
         if (response.ok) await response.json();
         refetch();
      }
   }


   let filterPlaced = data && data.filter(odr => odr?.orders?.status === "placed").reverse();
   let filterPending = data && data.filter(odr => odr?.orders?.status === "pending").reverse();
   let filterShipped = data && data.filter(odr => odr?.orders?.status === "shipped").reverse();


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
                     <h6>Pending Orders {filterPending && filterPending.length}</h6>
                     {
                        filterPending && filterPending.length > 0 ?
                           <Table striped responsive>
                              <thead>
                                 <tr>
                                    <th>Order Id</th>
                                    <th>Email</th>
                                    <th>Mode</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    filterPending && filterPending.map((odr) => {
                                       const { orderId, user_email, payment_mode, price_total, status } = odr?.orders;
                                       return (
                                          <tr key={orderId}>
                                             <td>{orderId}</td>
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
                                                <button onClick={() => cancelOrderHandler(user_email, orderId)}>Cancel</button>
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
               <div className="col-lg-12  mb-4 p-3">

                  <div className='card_default card_description'>
                     <h6>Placed Orders {filterPlaced && filterPlaced.length}</h6>
                     {
                        filterPending && filterPlaced.length > 0 ?

                           <Table striped responsive>
                              <thead>
                                 <tr>
                                    <th>Order Id</th>
                                    <th>Email</th>
                                    <th>Mode</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    filterPlaced && filterPlaced.map((odr) => {
                                       const { orderId, user_email, payment_mode, price_total, status } = odr?.orders;
                                       return (
                                          <tr key={orderId}>
                                             <td>{orderId}</td>
                                             <td>{user_email}</td>
                                             <td>{payment_mode}</td>
                                             <td>{price_total}$</td>
                                             <td>{status}</td>
                                             <td>{
                                                <button disabled={status === "shipped" ? true : false} className="status_btn"
                                                   onClick={() => updateOrderStatusHandler(
                                                      user_email,
                                                      orderId,
                                                      "shipped"
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
               <div className="col-12 card_default card_description">
                  <h6>All Shipped Orders</h6>
                  {
                     filterShipped && filterShipped.length >= 0 ?
                        <Table striped responsive>
                           <thead>
                              <tr>
                                 <th>Order Id</th>
                                 <th>Email</th>
                                 <th>Payment Mode</th>
                                 <th>Amount</th>
                                 <th>Status</th>
                              </tr>
                           </thead>
                           <tbody>
                              {
                                 filterShipped && filterShipped.map((odr, ind) => {
                                    const { orderId, user_email, payment_mode, price_total, status } = odr?.orders;
                                    return (
                                       <tr key={orderId}>
                                          <td>{orderId}</td>
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
         <Modal
            data={openModal}
            closeModal={() => setOpenModal(false)}
         ></Modal>
      </div >
   );
};

export default ManageOrders;
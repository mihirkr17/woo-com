import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../Hooks/useFetch';
import { auth } from '../../../firebase.init';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../../Hooks/useMessage';
import Modal from '../../../Components/Modal/Modal';

const ManageOrders = () => {
   const [user] = useAuthState(auth);
   const [seeMoreToggle, setSeeMoreToggle] = useState(0);
   const { msg, setMessage } = useMessage();
   const { data, refetch, loading } = useFetch(`https://woo-com-serve.herokuapp.com/manage-orders`);
   const [openModal, setOpenModal] = useState(false);

   if (loading) return <Spinner></Spinner>;
   const seeMoreToggleHandler = async (id) => id === seeMoreToggle ? setSeeMoreToggle(null) : setSeeMoreToggle(id);

   const cancelOrderHandler = async (orderId) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/cancel-order/${user?.email}/${orderId}`, { method: "DELETE" });
         if (response.ok) await response.json();
         refetch();
         setMessage(<strong className='text-success'>Order Cancelled...</strong>);
      }
   }

   const updateOrderStatusHandler = async (id, email, status) => {
      let confirmMsg = status === "placed" ? "Want To Placed This Order" : "Want To Shipped This Order";
      if (window.confirm(confirmMsg)) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/update-order-status/${email}/${id}/${status}`, { method: "PUT" });
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
               <div className="col-lg-6 mb-4 p-3">

                  <div className="card_default card_description">
                     <h6>Pending Orders {filterPending && filterPending.length}</h6>
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
                              filterPending && filterPending.length > 0 ? filterPending.map((odr, ind) => {
                                 const { orders } = odr;
                                 return (
                                    <tr key={orders?.orderId}>
                                       <td>{orders?.orderId}</td>
                                       <td>{orders?.user_email}</td>
                                       <td>{orders?.payment_mode}</td>
                                       <td>{orders?.total_amount}$</td>
                                       <td>{orders?.status}</td>
                                       <td>{
                                          <button disabled={odr?.status === "shipped" ? true : false} className="status_btn"
                                             onClick={() => updateOrderStatusHandler(
                                                orders?.orderId,
                                                orders?.user_email,
                                                "placed"
                                             )}>
                                             Place
                                          </button>
                                       }</td>
                                       <td>
                                          <button className="status_btn" onClick={() => setOpenModal(true && orders)}>Details</button>
                                       </td>
                                    </tr>
                                 )
                              })  : <tr><td>No Pending Order</td></tr>
                           }
                        </tbody>
                     </Table>
                  </div>
               </div>
               <div className="col-lg-6  mb-4 p-3">

                  <div className='card_default card_description'>
                     <h6>Placed Orders {filterPlaced && filterPlaced.length}</h6>
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
                              filterPlaced && filterPlaced.length > 0 ? filterPlaced.map((odr, ind) => {
                                 const { _id, orders } = odr;
                                 return (
                                    <tr key={orders?.orderId}>
                                       <td>{orders?.orderId}</td>
                                       <td>{orders?.user_email}</td>
                                       <td>{orders?.payment_mode}</td>
                                       <td>{orders?.total_amount}$</td>
                                       <td>{orders?.status}</td>
                                       <td>{
                                          <button disabled={odr?.status === "shipped" ? true : false} className="status_btn"
                                             onClick={() => updateOrderStatusHandler(
                                                orders?.orderId,
                                                orders?.user_email,
                                                "shipped"
                                             )}>
                                             Ship
                                          </button>
                                       }</td>
                                       <td>
                                          <button className="status_btn" onClick={() => setOpenModal(true && orders)}>Details</button>
                                       </td>
                                    </tr>
                                 )
                              }) : <tr><td>"No Placed Order"</td></tr>
                           }
                        </tbody>
                     </Table>
                  </div>


               </div>
               <div className="col-12 card_default card_description">
                  <h6>All Shipped Orders</h6>
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
                              const { _id, orders } = odr;
                              return (
                                 <tr key={orders?.orderId}>
                                    <td>{orders?.orderId}</td>
                                    <td>{orders?.user_email}</td>
                                    <td>{orders?.payment_mode}</td>
                                    <td>{orders?.total_amount}$</td>
                                    <td>{orders?.status}</td>
                                    <td>
                                       <button className="status_btn" onClick={() => setOpenModal(true && orders)}>Details</button>
                                    </td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </Table>
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
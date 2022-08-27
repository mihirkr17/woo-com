import React from 'react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';

const OrderTable = ({ orderList, updateOrderStatusHandler, cancelOrderHandler, setOpenModal, orderDispatchHandler,  setLabelModal}) => {


   return (
      <Table striped responsive>
         <thead>
            <tr>
               <th>Order Id</th>
               <th>Customer Email</th>
               <th>Payment Mode</th>
               <th>Total Amount</th>
               <th>Status</th>
            </tr>
         </thead>
         <tbody>
            {
               orderList && orderList.map((odr) => {
                  const { orderId, user_email, payment_mode, status, owner_commission, productId, quantity, totalAmount, seller } = odr?.orders;
                  let total_earn = totalAmount - parseFloat(owner_commission);
                  return (
                     <tr key={orderId}>

                        <td># <span className="text-info">{orderId}</span> </td>
                        <td>{user_email}</td>
                        <td>{payment_mode}</td>
                        <td>{totalAmount} Tk</td>
                        <td>{status}</td>
                        <td>
                           <button className='status_btn me-2' onClick={() => orderDispatchHandler(orderId, user_email)}>Dispatch</button>
                           <button className='status_btn me-2' onClick={() => setLabelModal(true && odr?.orders)}>Download Label</button>
                           <button className="status_btn" onClick={() => setOpenModal(true && odr?.orders)}>Details</button>
                        </td>
                        {
                           cancelOrderHandler && <td>
                              <button className='badge bg-danger' onClick={() => cancelOrderHandler(user_email, orderId)}>Cancel Order</button>
                           </td>
                        }

                     </tr>
                  )
               })
            }
         </tbody>
      </Table>
   );
};

export default OrderTable;
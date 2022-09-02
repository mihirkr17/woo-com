import React from 'react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import ConfirmDialog from '../../../Shared/ConfirmDialog';

const OrderTable = ({ orderList, cancelOrderHandler, setOpenModal, orderDispatchHandler, setLabelModal }) => {
   const [openBox, setOpenBox] = useState(false);


   return (
      <>
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

                     const { orderId, user_email, payment_mode, status, totalAmount } = odr?.orders;
                     return (
                        <tr key={orderId}>

                           <td># <span className="text-info">{orderId}</span> </td>
                           <td>{user_email}</td>
                           <td>{payment_mode}</td>
                           <td>{totalAmount} Tk</td>
                           <td>{status}</td>
                           <td>
                              {
                                 orderDispatchHandler && <>
                                    <button className='status_btn me-2' onClick={() => setOpenBox(odr?.orders)}>Dispatch</button>
                                    <button className='status_btn me-2' onClick={() => setLabelModal(true && odr?.orders)}>Download Label</button>
                                 </>
                              }
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
         <ConfirmDialog payload={{
            reference: openBox, openBox, setOpenBox,
            handler: orderDispatchHandler,
            text: `First make sure you downloaded the shipping label.
               So, if downloaded then dispatch this order.`,
            types: "Confirm"
         }} />
      </>
   );
};

export default OrderTable;
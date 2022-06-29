import React from 'react';
import { Table } from 'react-bootstrap';

const OrderTable = ({ orderList, updateOrderStatusHandler, cancelOrderHandler, setOpenModal }) => {

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
                  const { orderId, user_email, payment_mode, price_total, status, owner_commission, discount_amount_total } = odr?.orders;
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
                        {
                           updateOrderStatusHandler &&
                           <td>
                              <button className="status_btn"
                                 onClick={() => updateOrderStatusHandler(
                                    user_email,
                                    orderId,
                                    status,
                                    status === "placed" && parseFloat(owner_commission.toFixed(2)),
                                    status === "placed" && parseFloat(total_earn.toFixed(2))
                                 )}>
                                 {status === "pending" ? "Place Now" : status === "placed" ? "Ship Now" : ""}
                              </button>
                           </td>
                        }
                        <td>
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
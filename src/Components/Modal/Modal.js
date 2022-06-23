import React from 'react';
import "./Modal.css";

const Modal = ({ data, closeModal }) => {
   const { orderId, user_email, payment_mode, price_total, status, quantity, time_pending, address, discount, discount_amount_fixed, price } = data;
   return (
      <div className='modal_c' style={data ? { display: "block" } : { display: "none" }}>
         <div className="modal_body card_default card_description">
            <button className="modal_close" onClick={closeModal}>x</button>
            <div className="modal_wrapper">
               <div className="modal_text">
                  <table className='table table-responsive'>
                     <thead>
                        <tr>
                           <th>Order Details</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <th>OrderID</th>
                           <td>{orderId}</td>
                        </tr>
                        <tr>
                           <th>Order Email</th>
                           <td>{user_email}</td>
                        </tr>
                        <tr>
                           <th>Price</th>
                           <td>{price}$</td>
                        </tr>
                        <tr>
                           <th>Quantity</th>
                           <td>{quantity}</td>
                        </tr>
                        <tr>
                           <th>Discount</th>
                           <td>{discount}%</td>
                        </tr>
                        <tr>
                           <th>Total Amount</th>
                           <td>{price_total - discount_amount_fixed}$ Total amount (with minus discount)</td>
                        </tr>
                        <tr>
                           <th>Payment Mode</th>
                           <td>{payment_mode}</td>
                        </tr>
                        <tr>
                           <th>Status</th>
                           <td>{status}</td>
                        </tr>
                        <tr>
                           <th>Order Start Time</th>
                           <td>{time_pending}</td>
                        </tr>
                        {
                           data?.time_placed ?
                              <tr>
                                 <th>Order Placed Time</th>
                                 <td>{data?.time_placed}</td>
                              </tr> : ""
                        }
                        {
                           data?.time_shipped ?
                              <tr>
                                 <th>Order Shipped Time</th>
                                 <td>{data?.time_shipped}</td>
                              </tr> : ""
                        }
                        <tr>
                           <th>Order Customer Name</th>
                           <td>{address?.name}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Village</th>
                           <td>{address?.village}</td>
                        </tr>
                        <tr>
                           <th>Order Customer City</th>
                           <td>{address?.city}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Country</th>
                           <td>{address?.country}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Zip</th>
                           <td>{address?.zip}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Phone</th>
                           <td>{address?.phone}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Modal;
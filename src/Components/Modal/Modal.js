import React from 'react';
import "./Modal.css";

const Modal = ({ data, closeModal }) => {
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
                           <td>{data?.orderId}</td>
                        </tr>
                        <tr>
                           <th>Order Email</th>
                           <td>{data?.user_email}</td>
                        </tr>
                        <tr>
                           <th>Total Amount</th>
                           <td>{data?.total_amount}$</td>
                        </tr>
                        <tr>
                           <th>Payment Mode</th>
                           <td>{data?.payment_mode}</td>
                        </tr>
                        <tr>
                           <th>Total Product</th>
                           <td>{data?.total_product}</td>
                        </tr>
                        <tr>
                           <th>Status</th>
                           <td>{data?.status}</td>
                        </tr>
                        <tr>
                           <th>Order Start Time</th>
                           <td>{data?.time_pending}</td>
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
                           <td>{data?.address?.name}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Village</th>
                           <td>{data?.address?.village}</td>
                        </tr>
                        <tr>
                           <th>Order Customer City</th>
                           <td>{data?.address?.city}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Country</th>
                           <td>{data?.address?.country}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Zip</th>
                           <td>{data?.address?.zip}</td>
                        </tr>
                        <tr>
                           <th>Order Customer Phone</th>
                           <td>{data?.address?.phone}</td>
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
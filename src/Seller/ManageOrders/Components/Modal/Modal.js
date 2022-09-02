import React from 'react';
import "./Modal.css";

const Modal = ({ data, closeModal }) => {
   const { orderId, title, user_email, payment_mode, image, trackingId, delivery_service, package_dimension, status, quantity, time_pending, shipping_address, discount, price, totalAmount } = data && data;

   return (
      <div className='modal_c' style={data ? { display: "block" } : { display: "none" }}>
         <div className="modal_body card_description">
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
                           <th>Product</th>
                           <td>
                              <img src={image} alt="" style={{ width: "55px", height: "55px" }} />&nbsp;&nbsp;
                              <span>{title}</span>
                           </td>
                        </tr>
                        <tr>
                           <th>OrderID</th>
                           <td>{orderId}</td>
                        </tr>
                        <tr>
                           <th>Tracking ID</th>
                           <td>{trackingId}</td>
                        </tr>
                        <tr>
                           <th>Order Email</th>
                           <td>{user_email}</td>
                        </tr>
                        <tr>
                           <th>Price</th>
                           <td>{price} Tk</td>
                        </tr>
                        <tr>
                           <th>Quantity</th>
                           <td>{quantity}</td>
                        </tr>
                        <tr>
                           <th>Total Amount</th>
                           <td>{totalAmount} Tk</td>
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
                           <th>Shipping Address</th>
                           <td>
                              <pre>
                                 Customer : {shipping_address?.name} <br />
                                 Village  : {shipping_address?.village} <br />
                                 City     : {shipping_address?.city} <br />
                                 Country  : {shipping_address?.country} <br />
                                 Zip code : {shipping_address?.zip} <br />
                                 Phone    : {shipping_address?.phone}
                              </pre>
                           </td>
                        </tr>

                        <tr>
                           <th>In The Box</th>
                           <td>{delivery_service?.in_box}</td>
                        </tr>
                        <tr>
                           <th>Package Dimension</th>
                           <td>
                              <pre>
                                 weight : {package_dimension?.weight} kg <br />
                                 height : {package_dimension?.height} cm <br />
                                 length : {package_dimension?.length} cm <br />
                                 width  : {package_dimension?.width} cm
                              </pre>
                           </td>
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
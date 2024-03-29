import React from 'react';
import ModalWrapper from '../../../../Shared/ModalWrapper';

const OrderDetailsModal = ({ data, closeModal }) => {
   const { orderID, title, customerEmail, paymentMode, image, trackingID, shipping, orderStatus, variant, quantity, orderAT, shippingAddress, sellingPrice, baseAmount } = data && data;


   function getAttrs(obj = {}, optStr = "") {

      let str = [];

      for (let [key, value] of Object.entries(obj)) {

         if (typeof value === 'object' || typeof value === "undefined" || !value) {
            key = "";
            value = "";
         };

         str.push(
            <li key={key}><small>{key.replace(/[_+]/gi, " ").toUpperCase()} : {value + optStr} </small></li>
         )
      }

      return str.slice(0, 6);
   }

   return (
      <ModalWrapper closeModal={closeModal}>
         <div className="table-responsive">
            <table className='table '>
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
                     <td>{orderID}</td>
                  </tr>
                  <tr>
                     <th>Tracking ID</th>
                     <td>{trackingID}</td>
                  </tr>
                  <tr>
                     <th>Order Email</th>
                     <td>{customerEmail}</td>
                  </tr>
                  <tr>
                     <th>Price</th>
                     <td>{sellingPrice} Tk</td>
                  </tr>
                  <tr>
                     <th>Quantity</th>
                     <td>{quantity}</td>
                  </tr>
                  <tr>
                     <th>Total Amount</th>
                     <td>{baseAmount} Tk</td>
                  </tr>
                  <tr>
                     <th>Payment Mode</th>
                     <td>{paymentMode}</td>
                  </tr>
                  <tr>
                     <th>Status</th>
                     <td>{orderStatus}</td>
                  </tr>
                  <tr>
                     <th>Order Start Time</th>
                     <td>{orderAT?.time} / Date: {orderAT?.date}</td>
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
                        <ul>
                           {
                              getAttrs(shippingAddress)
                           }
                        </ul>
                     </td>
                  </tr>

                  <tr>
                     <th>Variant</th>
                     <td>
                        <ul>
                           {
                              getAttrs(variant)
                           }
                        </ul>
                     </td>
                  </tr>


                  <tr>
                     <th>In The Box</th>
                     <td>{shipping?.package?.inTheBox}</td>
                  </tr>
                  <tr>
                     <th>Package Dimension</th>
                     <td>
                        <ul>
                           <li><small>WEIGHT : {shipping?.package?.weight} kg</small></li>
                           {getAttrs(shipping?.package?.dimension, " cm")}
                        </ul>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </ModalWrapper>
   );
};

export default OrderDetailsModal;
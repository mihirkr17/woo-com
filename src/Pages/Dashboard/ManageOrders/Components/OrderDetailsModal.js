import React from 'react';
import ModalWrapper from '../../../../Shared/ModalWrapper';

const OrderDetailsModal = ({ data, closeModal }) => {
   const { orderID, title, customerEmail, paymentMode, image, trackingID, shipping, orderStatus, quantity, orderAT, shippingAddress, sellingPrice, totalAmount } = data && data;

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
                     <td>{totalAmount} Tk</td>
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
                        <pre>
                           Customer  : {shippingAddress?.name} <br />
                           Area      : {shippingAddress?.area} <br />
                           LandMark  : {shippingAddress?.landmark} <br />
                           City      : {shippingAddress?.city} <br />
                           Division  : {shippingAddress?.division} <br />
                           Zip code  : {shippingAddress?.postal_code} <br />
                           Phone     : {shippingAddress?.phone_number}
                        </pre>
                     </td>
                  </tr>

                  <tr>
                     <th>In The Box</th>
                     <td>{shipping?.package?.inTheBox}</td>
                  </tr>
                  <tr>
                     <th>Package Dimension</th>
                     <td>
                        <pre>
                           weight : {shipping?.package?.weight} kg <br />
                           height : {shipping?.package?.dimension?.height} cm <br />
                           length : {shipping?.package?.dimension?.length} cm <br />
                           width  : {shipping?.package?.dimension?.width} cm
                        </pre>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </ModalWrapper>
   );
};

export default OrderDetailsModal;
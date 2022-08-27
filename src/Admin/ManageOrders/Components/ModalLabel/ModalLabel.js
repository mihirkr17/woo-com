import React, { useRef } from 'react';
import Pdf from "react-to-pdf";
import fromDelivery from "../../../../Assets/shipping/from.png";
import toDelivery from "../../../../Assets/shipping/to.png";
import barcode from "../../../../Assets/shipping/barcode.png";

const ModalLabel = ({ data, closeModal, userInfo }) => {
   const ref = useRef();
   const { orderId, title, user_email, payment_mode, quantity, shipping_address, price, totalAmount } = data && data;

   return (
      <div className='modal_c' style={data ? { display: "block" } : { display: "none" }}>
         <div className="modal_body card_description">
            <button className="modal_close" onClick={closeModal}>x</button>
            <div>
               <Pdf targetRef={ref} filename={`woo-${orderId}.pdf`}>
                  {({ toPdf }) => <button className='status_btn' onClick={toPdf}>Generate Pdf</button>}
               </Pdf>
            </div>
            <div className="modal_wrapper">
               <div className="modal_text">
                  <div className="wrapper mx-auto card_default card_description" style={{width: "100%", height: "100%"}} ref={ref}>
                     <div className="d-flex align-items-center justify-content-around flex-wrap">
                        <small><strong>Order ID : {orderId}</strong></small>
                        <small><strong>Payment Mode : {payment_mode}</strong></small>
                     </div>
                     <hr />
                     <div className='seller_address d-flex align-items-center justify-content-center'>
                        <div className="xx_yhd me-4 border-end p-3">
                           <img src={fromDelivery} style={{ width: "100px", height: "auto" }} alt="" />
                        </div>
                        <div className='p-3'>
                           <h6>From : {userInfo?.seller}</h6>
                           <p>
                              {userInfo?.seller_address?.seller_village}, {userInfo?.seller_address?.seller_district}, <br />
                              {userInfo?.seller_address?.seller_country}, {userInfo?.seller_address?.seller_zip}
                           </p>
                        </div>
                     </div>
                     <hr />
                     <div className='shipping_details d-flex align-items-center justify-content-center'>
                        <div className='p-3'>
                           <h6>To : {shipping_address?.name}</h6>
                           <p>
                              {shipping_address?.village}, {shipping_address?.city} <br />
                              {shipping_address?.country}, {shipping_address?.zip} <br />
                              {shipping_address?.phone} <br />
                              {user_email}
                           </p>
                        </div>
                        <div className="xx_yhd me-4 border-start p-3">
                           <img src={toDelivery} style={{ width: "100px", height: "auto" }} alt="" />
                        </div>
                     </div>

                     <hr />
                     <div className="product_details py-3 d-flex">
                        <div className="barcode p-3">
                           <img src={barcode} alt="" />
                        </div>
                        <div>
                           <strong>{title}</strong> <br />
                           <pre className='p-3'>
                              Price        : {price} Tk <br />
                              Quantity     : {quantity} <br />
                              <hr />
                              Total Amount : {totalAmount} Tk
                           </pre>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ModalLabel;
import React, { useEffect, useRef } from 'react';
import Pdf from "react-to-pdf";
import fromDelivery from "../../../../Assets/shipping/from.png";
import toDelivery from "../../../../Assets/shipping/to.png";
import QRCode from "qrcode";
import ModalWrapper from '../../../../Shared/ModalWrapper';

const OrderLabelModal = ({ data, closeModal, userInfo }) => {
   const ref = useRef();
   const canvasRef = useRef();
   const { orderID, title, trackingID, paymentMode, orderAT, quantity, shippingAddress, sellingPrice, shippingCharge, totalAmount } = data && data;


   useEffect(() => {
      let str = "OrderID: " + orderID + ", Total Amount: " + totalAmount + ", Quantity: " + quantity;

      QRCode.toCanvas(
         canvasRef.current,
         str || " ",
         (error) => error && console.error(error)
      );
   }, [orderID, totalAmount, quantity]);

   return (
      <ModalWrapper closeModal={closeModal}>
         <div>
            <Pdf targetRef={ref} filename={`WooKart-OID-${orderID}.pdf`}>
               {({ toPdf }) => <button className='status_btn' onClick={toPdf}>Generate Pdf</button>}
            </Pdf>
         </div>
         <div className="wrapper mx-auto card_default card_description" style={{ width: "90%", height: "100%" }} ref={ref}>
            <div className="d-flex align-items-center justify-content-around flex-wrap">
               <small><strong>Order ID : {orderID}</strong></small>
               <small><strong>Tracking Number : {trackingID}</strong></small>
               <small><strong>Payment Mode : {paymentMode}</strong></small>
            </div>

            <small className="py-1 text-center">
               Order Creation Date : {orderAT?.date} at {orderAT?.time}
            </small>
            <hr />
            <div className='seller_address d-flex align-items-center justify-content-center'>
               <div className="xx_yhd me-4 border-end p-3">
                  <img src={fromDelivery} style={{ width: "80px", height: "auto" }} alt="" />
               </div>
               <div className='p-2'>
                  <h6 style={{ fontSize: "0.9rem" }}>Shipper Name : {userInfo?.seller?.storeInfos?.storeName}</h6>
                  <p>
                     <small>
                        {userInfo?.seller?.address?.area},&nbsp;{userInfo?.seller?.address?.city}, <br />
                        {userInfo?.seller?.address?.country},&nbsp;{userInfo?.seller?.address?.postal_code} <br />
                        Phone : {userInfo?.phone}
                     </small>
                  </p>
               </div>
            </div>
            <hr />
            <div className='shipping_details d-flex align-items-center justify-content-center'>
               <div className='p-2'>
                  <h6 style={{ fontSize: "0.9rem" }}>Recipient : {shippingAddress?.name}</h6>
                  <p>
                     <small>
                        {shippingAddress?.area},&nbsp;{shippingAddress?.city},&nbsp;
                        {shippingAddress?.division},&nbsp;{shippingAddress?.postal_code} <br />
                        Landmark : {shippingAddress?.landmark} <br />
                        Phone Number : {shippingAddress?.phone_number} <br />
                     </small>
                  </p>
               </div>
               <div className="xx_yhd me-4 border-start p-3">
                  <img src={toDelivery} style={{ width: "80px", height: "auto" }} alt="" />
               </div>
            </div>

            <hr />
            <div className="product_details py-3 d-flex">
               <div className="barcode p-3">
                  <canvas style={{ width: "100px" }} ref={canvasRef}></canvas>
               </div>
               <div>
                  <strong>{title}</strong> <br />
                  <small>
                     <pre className='p-3'>
                        Price        : {sellingPrice} Tk (+ shipping charge {shippingCharge} Tk)<br />
                        Quantity     : x {quantity} <br />
                        <hr />
                        Total Amount : {totalAmount} Tk (BDT)
                     </pre>
                  </small>
               </div>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default OrderLabelModal;
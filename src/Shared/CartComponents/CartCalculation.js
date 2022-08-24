import React from 'react';
import "./CartCalculation.css";

const CartCalculation = ({ product, headTitle }) => {
   return (
      <div className="cart_card">
         <h6>{headTitle ? headTitle : "Price Details"}</h6>
         <hr />
         <div className="py-3 cart_card_body">
            <p><span>Sub Total({product?.totalQuantity || 0})</span> <span>{product?.totalPrice || 0}&nbsp;TK</span></p>
            <p><span>Shipping Fee</span><span>{product?.shippingFee || 0}&nbsp;TK</span></p>
            <hr />
            <p><span>Total Amount</span><span>{product?.totalAmount || 0}&nbsp;TK</span></p>
            <p className='py-2 px-1 border rounded mt-3'>
               <small>
                  <i>Your total Saving amount on this order&nbsp;</i>
               </small>
               <small className="text-info">{product?.totalDiscount}&nbsp;TK</small>
            </p>
         </div>
      </div>
   );
};

export default CartCalculation;
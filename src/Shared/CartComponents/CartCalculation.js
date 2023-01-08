import React from 'react';
import "./CartCalculation.css";

const CartCalculation = ({ product, headTitle }) => {

   return (
      <div className="py-1">
         <h6>{headTitle ? headTitle : "Price Details"}</h6>
         <hr />
         <div className="py-3 cart_card_body">
            <p><span>Sub Total({product?.totalQuantities || 0})</span> <span>{product?.totalAmounts || 0}&nbsp;TK</span></p>
            <p><span>Shipping Fee</span><span>{product?.shippingFees || 0}&nbsp;TK</span></p>
            <hr />
            <p><span>Final Amount</span><span>{product?.finalAmounts || 0}&nbsp;TK</span></p>
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
import React from 'react';

const CartCalculation = ({ product }) => {
   return (
      <div className="card_default">
         <div className="card_description">
            <div className="text-truncate pb-2">Price Details</div>
            <pre>Total Price({product?.totalQuantity || 0}) : {product?.totalPrice + "$" || 0}</pre>
            <pre>Discount : -{product?.totalDiscount + "$" || 0}</pre>
            <hr />
            <code>Total Amount : {product?.totalAmount() + "$" || 0}</code>
         </div>
      </div>
   );
};

export default CartCalculation;
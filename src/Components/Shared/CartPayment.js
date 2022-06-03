import React from 'react';

const CartPayment = ({ buyBtnHandler, dataProductLength, selectAddress }) => {
   return (
      <div className='card_default'>
         <div className="card_description">
            <form onSubmit={buyBtnHandler}>
               <select name="payment" id="payment" className='form-select form-select-sm mb-3'>
                  <option value="cod">Cash On Delivery</option>
               </select>
               <button className='btn btn-primary btn-sm'
                  disabled={(selectAddress === true) && (dataProductLength > 0 ) ? false : true}>
                  Buy
               </button>
            </form>
         </div>
      </div>
   );
};

export default CartPayment;
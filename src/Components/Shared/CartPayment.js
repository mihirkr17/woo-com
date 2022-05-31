import React from 'react';

const CartPayment = () => {
   return (
      <div className='card_default'>
         <div className="card_description">
            <form>
               <label htmlFor="COD">
                  <input type="radio" name="payment" value={'cod'} id="COD"/>
                  <span>Cash On Delivery</span>
               </label>
            </form>
         </div>
      </div>
   );
};

export default CartPayment;
import React from 'react';
import { useState } from 'react';

const CartPayment = ({ buyBtnHandler, isStock, step, products }) => {
   let card = products && products.find(p => p?.paymentInfo.includes('card'));

   const [payment, setPayment] = useState("");

   console.log(payment)


   return (
      <div className='cart_card'>
         <h6>Select Payment Mode</h6>
         <hr />
         <div className="row">
            <div className="col-12">

               <form onSubmit={buyBtnHandler}>
                  <select name="payment" id="payment" className='form-select form-select-sm mb-3'>
                     <option value="cod">Cash On Delivery</option>
                  </select>
                  <button className='bt9_checkout' disabled={(isStock && step) ? false : true} type='submit'>
                     Place Order
                  </button>
               </form>

               <div className="py-3">
                  <div className="payment_option">
                     <label htmlFor="COD">
                        <input type="radio" id='COD' name='others' disabled={card ? true : false}/>
                        <span>Cash On Delivery</span>

                     </label>
                     <br />
                     <label htmlFor="CARD">
                        <input type="radio" id='CARD' name='others' value='card' onChange={(e) => setPayment(e.value)} />
                        <span>Credit/Atm/Debit Card</span>

                     </label>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartPayment;
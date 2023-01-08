import React from 'react';
import { useState } from 'react';
import { paymentMode } from '../../Assets/CustomData/paymentMode';


const CartPayment = ({ buyBtnHandler, isStock, step, products }) => {
   let card = products && products.filter(p => p?.paymentInfo.includes('card'));
   console.log(card);

   const [payment, setPayment] = useState("");


   return (
      <div className='py-1'>
         <h6>Select Payment Mode</h6>
         <hr />
         <div className="row">
            <div className="col-12">

               <form onSubmit={buyBtnHandler}>

                  <select name="payment" id="payment" className='form-select form-select-sm mb-3' onChange={(e) => setPayment(e.target.value)}>
                     <option value="">Select Payment Method</option>
                     {
                        paymentMode && paymentMode.map((paymentMethod, i) => {
                           return (
                              <>
                                 {
                                    paymentMethod === 'cod' && card ?
                                       <option key={i} disabled value={paymentMethod}>{paymentMethod}</option> :
                                       <option key={i} value={paymentMethod}>{paymentMethod}</option>
                                 }
                              </>
                           )
                        })
                     }
                  </select>

                  <div className="py-3">
                     <div className="payment_option">
                        <label htmlFor="COD">
                           <input type="radio" id='COD' name='others' disabled={card ? true : false} />
                           <span>Cash On Delivery</span>

                        </label>
                        <br />
                        <label htmlFor="CARD">
                           <input type="radio" id='CARD' name='others' value='card' onChange={(e) => setPayment(e.value)} />
                           <span>Credit/Atm/Debit Card</span>

                        </label>
                     </div>
                  </div>
                  <button className='bt9_checkout' disabled={(isStock && step) ? false : true} type='submit'>
                     Place Order
                  </button>
               </form>


            </div>
         </div>
      </div>
   );
};

export default CartPayment;
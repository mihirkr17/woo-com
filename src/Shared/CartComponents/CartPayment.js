import React from 'react';
import { paymentOption } from '../../Assets/CustomData/paymentMode';


const CartPayment = ({ paymentMode, setPaymentMode, buyBtnHandler, isStock, step, products, isAddress }) => {

   // const isCod = products && products.map(p => p?.paymentInfo).every(s => s.includes("cod"));


   return (
      <div className='py-1'>
         <h6>Select Payment Mode</h6>
         <hr />
         <div className="row">
            <div className="col-12">

               <form onSubmit={buyBtnHandler}>

                  <select name="payment" id="payment" className='form-select form-select-sm mb-3' onChange={(e) => setPaymentMode(e.target.value)}>
                     <option value="">Select Payment Method</option>
                     {
                        paymentOption && paymentOption.map((paymentOpt, i) => {
                           return (
                              <option key={i} value={paymentOpt}>{paymentOpt}</option>
                           )
                        })
                     }
                  </select>

                  {
                     !isAddress && <p>Please select shipping address.</p> 
                  }

                  <button className='bt9_checkout' disabled={(isStock && isAddress) ? false : true} type='submit'>
                     Place Order
                  </button>
               </form>


            </div>
         </div>
      </div>
   );
};

export default CartPayment;
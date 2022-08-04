import React from 'react';

const CartPayment = ({ buyBtnHandler, isStock }) => {
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
                  <button className='btn btn-warning btn-sm' disabled={isStock ? false : true} type='submit'>
                     Buy Now
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
};

export default CartPayment;
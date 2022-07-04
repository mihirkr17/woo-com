import React from 'react';

const CartPayment = ({ buyBtnHandler }) => {
   return (
      <div className='card_default'>
         <div className="card_description">
            <div className="row">
               <div className="col-12">
                  <div className='mb-1'>
                     <h6 className='badge bg-success'>Select Payment Mode</h6>
                  </div>
                  <form onSubmit={buyBtnHandler}>
                     <select name="payment" id="payment" className='form-select form-select-sm mb-3'>
                        <option value="cod">Cash On Delivery</option>
                     </select>
                     <button className='btn btn-primary btn-sm' type='submit'>
                        Buy
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartPayment;
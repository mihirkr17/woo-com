import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../App';
import { useMessage } from '../../Hooks/useMessage';
import { cartCalculate } from '../../Shared/common';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';

const Cart = () => {
   const user = useAuthUser();
   const { userInfo, authRefetch, authLoading } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const [step, setStep] = useState(false);
   const navigate = useNavigate();

   const goCheckoutPage = async (id) => {
      if (step) {
         navigate(`/my-cart/checkout/${id}`);
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <p><strong className='text-danger'>{msg}</strong></p>
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <CartAddress navigate={navigate} authRefetch={authRefetch} addr={userInfo?.address ? userInfo?.address : []} setStep={setStep}></CartAddress>
                  <br />
                  <div className="cart_card">
                     <h6>Total In Cart ({(userInfo?.myCartProduct && userInfo?.myCartProduct.length) || 0})</h6>
                     <hr />
                     {
                        userInfo?.myCartProduct && userInfo?.myCartProduct ? userInfo?.myCartProduct.map(product => {
                           return (
                              <CartItem navigate={navigate} authRefetch={authRefetch} key={product?._id} authLoading={authLoading} product={product} cartTypes={"toCart"} setMessage={setMessage}></CartItem>
                           )
                        }) :
                           <div className="card_default">
                              <div className="card_description">
                                 <h3 className="cart_title">No Product Available In Your Cart</h3>
                              </div>
                           </div>
                     }
                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartHeader user={user}></CartHeader>
                  <br />
                  <CartCalculation product={cartCalculate(userInfo && userInfo?.myCartProduct)}></CartCalculation>
                  <br />
                  <div className="text-center">
                     {(userInfo?.address && userInfo?.address.length === 0) && <small className="my-2 p-1">Please Insert Your Address</small>}
                     {((userInfo?.address && userInfo?.address.length > 0) && (step === false)) && <small className="my-2 p-1">Select Your Address</small>}
                     {(userInfo?.myCartProduct && userInfo?.myCartProduct.length === 0) && <small className="my-2 p-1">Please Add Product To Your Cart</small>}
                     <button className='bt9_checkout' onClick={() => goCheckoutPage(userInfo?._id)}
                        disabled={(step === true) && (userInfo?.myCartProduct && userInfo?.myCartProduct.length > 0) ? false : true}>
                        Checkout
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;
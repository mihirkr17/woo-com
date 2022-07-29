import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../App';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import "./Cart.css";

const Cart = () => {
   const user = useAuthUser();
   const { refetch, cart, cartProductCount } = useCart();
   const { msg, setMessage } = useMessage();
   const [step, setStep] = useState(false);
   const navigate = useNavigate();

   const goCheckoutPage = async (id) => {
      navigate(`/my-cart/checkout/${id}`);
   }

   return (
      <div className='section_default'>
         <div className="container">
            <p><strong className='text-danger'>{msg}</strong></p>
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <CartAddress refetch={refetch} addr={cart?.address ? cart?.address : []} user={user} step={step} setStep={setStep}></CartAddress>
                  <br />
                  <div className="cart_card">
                     <h6>Total In Cart ({(cartProductCount) || 0})</h6>
                     <hr />
                     {
                        cart?.product && cart?.product ? cart?.product.map(product => {
                           return (
                              <CartItem key={product?._id} user={user} product={product} cartTypes={"toCart"} refetch={refetch} setMessage={setMessage}></CartItem>
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
                  <CartCalculation product={cartCalculate(cart && cart?.product)}></CartCalculation>
                  <br />
                  <div className="text-center">
                     {(cart?.address && cart?.address.length === 0) && <small className="my-2 p-1">Please Insert Your Address</small>}
                     {((cart?.address && cart?.address.length > 0) && (step === false)) && <small className="my-2 p-1">Select Your Address</small>}
                     {(cart?.product && cart?.product.length === 0) && <small className="my-2 p-1">Please Add Product To Your Cart</small>}
                     <button className='btn btn-info btn-sm w-100' onClick={() => goCheckoutPage(cart?._id)}
                        disabled={(step === true) && (cart?.product && cart?.product.length > 0) ? false : true}>
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
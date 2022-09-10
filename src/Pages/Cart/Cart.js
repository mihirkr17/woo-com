import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../App';
import { useMessage } from '../../Hooks/useMessage';
import { cartCalculate } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';

const Cart = () => {
   const user = useAuthUser();
   const { userInfo, authRefetch } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();

   const goCheckoutPage = async (id) => {
      if ((!userInfo?.myCartProduct || typeof userInfo?.myCartProduct === "undefined") || (userInfo?.myCartProduct.length <= 0)) {
         return setMessage("Your cart is empty. Please add product to your cart", "danger");
      }
      return navigate(`/my-cart/checkout/${id}`);
   }

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card">
                     <h6>Total In Cart ({(userInfo?.myCartProduct && userInfo?.myCartProduct.length) || 0})</h6>
                     <hr />
                     {
                        (userInfo?.myCartProduct && userInfo?.myCartProduct.length > 0) ? userInfo?.myCartProduct.map(product => {
                           return (
                              <CartItem navigate={navigate} authRefetch={authRefetch} key={product?._id} product={product} cartTypes={"toCart"} setMessage={setMessage}></CartItem>
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
                     {(typeof userInfo?.myCartProduct === "undefined") && <small className="my-2 p-1">Please Add Product To Your Cart</small>}
                     <button className='bt9_checkout' disabled={(!userInfo?.myCartProduct || typeof userInfo?.myCartProduct === "undefined" || (userInfo?.myCartProduct.length <= 0)) ? true : false} onClick={() => goCheckoutPage(userInfo?._id)}>
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
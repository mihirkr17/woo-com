import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../Hooks/useMessage';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';
import { useCartContext } from '../../lib/CartProvider';


const Cart = () => {
   const { userInfo, cartQtyUpdater } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();
   const { cartData, cartRefetch } = useCartContext();


   // Go checkout page
   const goCheckoutPage = async (uuid, params) => {
      if (cartData?.products && cartData?.products.length < 0) {
         return setMessage("Your cart is empty. Please add product to your cart", "danger");
      }
      return navigate(`/checkout?spa=${uuid}.${params}`);
   }

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card">
                     <h6>Total In Cart ({(cartData?.numberOfProducts && cartData?.numberOfProducts) || 0})</h6>
                     <hr />
                     {
                        Array.isArray(cartData?.products) && cartData?.numberOfProducts > 0 ? cartData?.products.map(product => {
                           return (
                              <CartItem
                                 key={product?.variationID}
                                 cartRefetch={cartRefetch}
                                 product={product}
                                 cartType={"toCart"}
                                 checkOut={false}
                                 setMessage={setMessage}
                                 cartQtyUpdater={cartQtyUpdater}
                                 items={cartData?.numberOfProducts}
                              />
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
                  <div className="cart_card">
                     <CartCalculation
                        product={cartData?.container_p && cartData?.container_p}
                     />

                     <br />

                     <div className="text-center">
                        {
                           (cartData?.numberOfProducts <= 0) &&
                           <small className="my-2 p-1">Please Add Product To Your Cart</small>
                        }
                        <button className='bt9_checkout' disabled={(cartData?.numberOfProducts <= 0) ? true : false} onClick={() => goCheckoutPage(userInfo?._UUID, "cart.proceed_to_checkout")}>
                           Proceed To Checkout
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;
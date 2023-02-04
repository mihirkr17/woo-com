import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../Hooks/useMessage';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';


const Cart = () => {
   const { userInfo, authRefetch } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();

   // Go checkout page
   const goCheckoutPage = async (id) => {
      if (userInfo?.buyer?.shoppingCart?.products && userInfo?.buyer?.shoppingCart?.products.length < 0) {
         return setMessage("Your cart is empty. Please add product to your cart", "danger");
      }
      return navigate(`/my-cart/checkout`);
   }

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card">
                     <h6>Total In Cart ({(userInfo?.buyer?.shoppingCart?.numberOfProducts && userInfo?.buyer?.shoppingCart?.numberOfProducts) || 0})</h6>
                     <hr />
                     {
                        Array.isArray(userInfo?.buyer?.shoppingCart?.products) && userInfo?.buyer?.shoppingCart?.numberOfProducts > 0 ? userInfo?.buyer?.shoppingCart?.products.map(product => {

                           return (
                              <CartItem
                                 key={product?._id}
                                 refetch={authRefetch}
                                 product={product}
                                 cartTypes={"toCart"}
                                 setMessage={setMessage}
                              ></CartItem>
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
                        product={userInfo?.buyer?.shoppingCart?.container_p && userInfo?.buyer?.shoppingCart?.container_p}
                     />

                     <br />

                     <div className="text-center">
                        {
                           (userInfo?.buyer?.shoppingCart?.numberOfProducts <= 0) &&
                           <small className="my-2 p-1">Please Add Product To Your Cart</small>
                        }
                        <button className='bt9_checkout' disabled={(userInfo?.buyer?.shoppingCart?.numberOfProducts <= 0) ? true : false} onClick={() => goCheckoutPage(userInfo?._id)}>
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
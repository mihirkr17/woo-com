import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../Hooks/useMessage';
import { cartCalculate } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';
import { useFetch } from '../../Hooks/useFetch';


const Cart = () => {
   const { userInfo } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();

   const { data: cartItems, loading, refetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/cart/show-my-cart-items`);

   // Go checkout page
   const goCheckoutPage = async (id) => {
      if (cartItems?.data?.products && cartItems?.data?.products.length < 0) {
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
                     <h6>Total In Cart ({(cartItems?.data?.items && cartItems?.data?.items) || 0})</h6>
                     <hr />
                     {
                        (cartItems?.data?.products && cartItems?.data?.products.length > 0) ? cartItems?.data?.products.map(product => {
                     
                           return (
                              <CartItem
                                 key={product?._id}
                                 refetch={refetch}
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
                  {/* <CartHeader user={userInfo}></CartHeader> */}
                  {/* <br /> */}
                  <CartCalculation
                     product={cartCalculate(cartItems?.data?.products && cartItems?.data?.products)}
                  />

                  <br />

                  <div className="text-center">
                     {(cartItems?.data?.products && cartItems?.data?.products.length <= 0) && <small className="my-2 p-1">Please Add Product To Your Cart</small>}
                     <button className='bt9_checkout' disabled={(cartItems?.data?.products && cartItems?.data?.products.length <= 0) ? true : false} onClick={() => goCheckoutPage(userInfo?._id)}>
                        Proceed To Checkout
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;
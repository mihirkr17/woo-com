import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';
import { useCartContext } from '../../lib/CartProvider';


const Cart = () => {
   const { userInfo, cartQtyUpdater, setMessage } = useAuthContext();
   const navigate = useNavigate();
   const { cartData, cartRefetch } = useCartContext();


   // Go checkout page
   const goCheckoutPage = async (uuid, params) => {


      let products = cartData && cartData?.products.filter(p => p?.stock === "in");

      if (products && products.length <= 0) {
         return setMessage("Your cart is empty. Please add product to your cart", "danger");
      }

      const baseAmounts = products && products.map((tAmount) => (parseInt(tAmount?.baseAmount))).reduce((p, c) => p + c, 0);
      const totalQuantities = products && products.map((tQuant) => (parseInt(tQuant?.quantity))).reduce((p, c) => p + c, 0);
      const shippingFees = products && products.map((p) => parseInt(p?.shippingCharge)).reduce((p, c) => p + c, 0);
      const finalAmounts = products && products.map((fAmount) => (parseInt(fAmount?.baseAmount) + fAmount?.shippingCharge)).reduce((p, c) => p + c, 0);
      const savingAmounts = products && products.map((fAmount) => (parseInt(fAmount?.savingAmount))).reduce((p, c) => p + c, 0);

      return navigate(`/checkout?spa=${uuid}.${params}`, {
         state: {
            products,
            container_p: {
               baseAmounts, totalQuantities, shippingFees, finalAmounts, savingAmounts
            },
            numberOfProducts: products.length || 0,
         }
      });
   }

   return (
      <div className='section_default'>
         <div className="container">
            {/* {msg} */}
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
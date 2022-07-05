import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { useCart } from '../../lib/CartProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import "./Cart.css";

const Cart = ({ setCartProductCount }) => {
   const user = useAuthUser();
   const { msg, setMessage } = useMessage();
   const [step, setStep] = useState(false);
   const navigate = useNavigate();
   const { data, loading, refetch, productLength } = useCart();

   useEffect(() => {
      setCartProductCount(productLength);
   }, [setCartProductCount, productLength]);

   if (loading) return <Spinner></Spinner>;


   const goCheckoutPage = async (id) => {
      navigate(`/my-cart/checkout/${id}`);
   }

   return (
      <div className='section_default'>
         <div className="container">
            <p><strong className='text-danger'>{msg}</strong></p>
            <div className="row">
               <div className="col-lg-8">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <CartHeader user={user}></CartHeader>
                     </div>
                     <div className="col-12 my-3">
                        <div className="cart_card">
                           <h6>Total In Cart ({(productLength) || 0})</h6>
                           <hr />
                           {
                              data && data?.product ? data?.product.map(product => {
                                 return (
                                    <CartItem key={product?._id} user={user} product={product} refetch={refetch} setMessage={setMessage}></CartItem>
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
                  </div>
               </div>
               <div className="col-lg-4">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <CartCalculation product={cartCalculate(data?.product)}></CartCalculation>
                     </div>
                     <div className="col-12 mb-3">
                        <CartAddress refetch={refetch} addr={data?.address ? data?.address : ""} user={user} step={step} setStep={setStep}></CartAddress>
                     </div>
                     <div className="col-12 text-center">
                        <button className='btn btn-info btn-sm w-100' onClick={() => goCheckoutPage(data?._id)}
                           disabled={(step === true) && (data?.product.length > 0) ? false : true}>
                           Checkout
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
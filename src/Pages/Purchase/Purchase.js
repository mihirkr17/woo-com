import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { useCart } from '../../lib/CartProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';


const Purchase = ({ setCartProductCount }) => {
   const { productId } = useParams();
   const user = useAuthUser();
   const { data: cart, refetch, loading, productLength } = useCart();
   const { msg, setMessage } = useMessage("");
   const navigate = useNavigate();
   const [step, setStep] = useState(false);
   const product = cart?.product.find(p => p?._id === productId);

   useEffect(() => {
      setCartProductCount(productLength);
   }, [setCartProductCount, productLength]);

   useEffect(() => {
      if (msg !== '') return navigate('/my-cart');
   }, [msg, navigate])

   // if (loading) return <Spinner></Spinner>;

   const goCheckoutPage = (productId) => {
      navigate(`/my-cart/checkout-single/${productId}`)
   }

   return (
      <div className='section_default'>
         <div className="container">
            <p><strong className='text-danger'>{msg}</strong></p>
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <CartAddress refetch={refetch} user={user} addr={cart?.address ? cart?.address : []} step={step} setStep={setStep}></CartAddress>
                  <br />
                  <CartItem product={product} refetch={refetch} user={user} setMessage={setMessage}></CartItem>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartHeader user={user}></CartHeader>
                  <br />
                  <CartCalculation product={cartCalculate([product])} />
                  <br />
                  <div className="text-center">
                     {(cart?.address && cart?.address.length === 0) && <small className="my-2 p-1">Please Insert Your Address</small>}
                     {((cart?.address.length > 0) && (step === false)) && <small className="my-2 p-1">Select Your Address</small>}
                     <button className='btn btn-info btn-sm w-100' onClick={() => goCheckoutPage(product?._id)}
                        disabled={step === true ? false : true}>
                        Checkout
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

};

export default Purchase;
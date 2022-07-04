import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartHeader from '../../Shared/CartComponents/CartHeader';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';


const Purchase = () => {
   const BASE_URL = useBASE_URL();
   const { productId } = useParams();
   const user = useAuthUser();
   const { data: cart, refetch, loading } = useFetch(`${BASE_URL}my-cart-item/${productId}/${user?.email}`);
   const { msg, setMessage } = useMessage("");
   const navigate = useNavigate();
   const [step, setStep] = useState(false);

   if (msg !== '') return navigate('/');
   if (loading) return <Spinner></Spinner>;

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);
      let priceFixed = parseFloat(cart?.product?.price_fixed);
      let productQuantity = parseInt(cart?.product?.quantity);

      let commission = 0;
      let commission_rate = 0;

      if (priceFixed > 50) {
         commission = (priceFixed * 3) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else if (priceFixed > 100) {
         commission = (priceFixed * 6) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else if (priceFixed > 150) {
         commission = (priceFixed * 9) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else if (priceFixed > 200) {
         commission = (priceFixed * 12) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else if (priceFixed > 250) {
         commission = (priceFixed * 15) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else if (priceFixed > 300) {
         commission = (priceFixed * 18) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      } else {
         commission = (priceFixed * 1.5) / 100;
         commission_rate = commission;
         commission = commission * productQuantity;
      }

      let products = {
         orderId: orderId,
         user_email: user?.email,
         owner_commission_rate: parseFloat(commission_rate.toFixed(2)),
         owner_commission: parseFloat(commission.toFixed(2)),
         _id: cart?.product._id,
         product_name: cart?.product.title,
         image: cart?.product.image,
         category: cart?.product.category,
         quantity: cart?.product.quantity,
         price: cart?.product.price,
         price_fixed: cart?.product.price_fixed,
         price_total: cart?.product.price_total,
         discount: cart?.product.discount,
         discount_amount_fixed: cart?.product.discount_amount_fixed,
         discount_amount_total: cart?.product.discount_amount_total,
         seller: cart?.product.seller,
         address: cart?.address && cart?.address,
         payment_mode: payment_mode,
         status: "pending",
         time_pending: new Date().toLocaleString()
      }

      if (window.confirm("Buy Now")) {
         const response = await fetch(`${BASE_URL}set-order/${user?.email}`, {
            method: "POST",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({ ...products })
         });

         response.ok ? await response.json() && navigate(`/my-profile/my-order`) :
            setMessage(<strong className='text-danger'>Something went wrong!</strong>);
      }
   }

   const goCheckoutPage = (productId) => {
      navigate(`/my-cart/checkout-single/${productId}`)
   }

   return (
      <div className='section_default'>
         {msg}
         <div className="container">
            <div className="row">
               <div className="col-lg-8">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <CartHeader user={user}></CartHeader>
                     </div>

                     <div className="col-12 my-3">
                        <CartItem product={cart?.product} refetch={refetch} user={user} setMessage={setMessage}></CartItem>
                     </div>
                  </div>
               </div>
               <div className="col-lg-4">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <CartCalculation product={cartCalculate([cart?.product])} />
                     </div>
                     <div className="col-12 my-3">
                        <CartAddress refetch={refetch} user={user} addr={cart?.address ? cart?.address : []} step={step} setStep={setStep}></CartAddress>
                     </div>
                     <div className="col-12 my-3">
                        {/* <CartPayment buyBtnHandler={buyBtnHandler} dataProductLength={1} selectAddress={cart?.address?.select_address} ></CartPayment> */}
                        <button className='btn btn-info btn-sm' onClick={() => goCheckoutPage(cart?.product?._id)}
                           disabled={(step === true) && (cart?.product.length > 0) ? false : true}>
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

export default Purchase;
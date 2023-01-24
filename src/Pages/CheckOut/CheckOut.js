import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { useAuthContext } from '../../lib/AuthProvider';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import { useFetch } from '../../Hooks/useFetch';

const CheckOut = () => {
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { authLoading, authRefetch, userInfo } = useAuthContext();
   const [step, setStep] = useState(false);
   const { data: cartItems } = useFetch(`${process.env.REACT_APP_BASE_URL}api/v1/cart/show-my-cart-items`);

   // pick the address where selected address is true
   const selectedAddress = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(a => a?.default_shipping_address === true);

   const products = Array.isArray(cartItems?.data?.products) ? cartItems?.data?.products : [];

   const buyBtnHandler = async (e) => {
      e.preventDefault();

      if ((cartItems?.data?.numberOfProducts <= 0 || !step)) {
         return setMessage("No Products to buy", "warning");
      }

      let buyAlert = window.confirm("Buy Now");
      let payment_mode = e.target.payment.value;

      for (let i = 0; i < products.length; i++) {
         let elem = products[i];
         let orderId = Math.floor(Math.random() * 1000000000);
         let trackingId = ("TR00" + orderId);

         let product = {
            orderId: orderId,
            trackingId,
            user_email: userInfo?.email,
            productId: elem._id,
            title: elem?.title,
            slug: elem?.slug,
            brand: elem?.brand,
            image: elem.image,
            sku: elem?.sku,
            price: elem?.price,
            totalAmount: elem?.totalAmount,
            quantity: elem?.quantity,
            seller: elem?.seller,
            payment_mode: payment_mode,
            shipping_address: selectedAddress,
            package_dimension: elem?.package_dimension,
            delivery_service: elem?.delivery_service,
         }

         if (buyAlert) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/set-order/`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  authorization: `${userInfo?.email}`
               },
               body: JSON.stringify({ ...product })
            });

            const resData = await response.json();

            if (response.status >= 200 && response.status <= 299) {
               authRefetch();
               navigate(`/my-profile/my-order?order=${resData?.message}`);
            } else {
               setMessage(resData?.message, 'danger');
               return;
            }
         }
      }

   }

   if (authLoading) {
      return <Spinner></Spinner>;
   }
   return (
      <div className='section_default'>
         <div className="container">
            <div className="mb-4">
               <Link to='/my-cart'> <FontAwesomeIcon icon={faLeftLong} /> Back To Cart</Link>
            </div>
            {msg}


            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card">
                     <CartAddress setMessage={setMessage} navigate={navigate} authRefetch={authRefetch} addr={userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []} setStep={setStep} />
                     <br />

                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row">
                        {
                           cartItems?.data?.products && cartItems?.data?.products.filter(p => p?.variations?.stock === "in").map((products, index) => {
                              return (
                                 <CartItem
                                    cartTypes={"toCart"}
                                    checkOut={true}
                                    product={products}
                                    key={index}
                                 />
                              )
                           })
                        }
                     </div>

                  </div>


                  <br />
               </div>
               <div className="col-lg-4 mb-3">

                  <div className="cart_card">
                     <CartCalculation product={cartItems?.data?.container_p && cartItems?.data?.container_p}
                        headTitle={"Order Details"}></CartCalculation>
                     <br />
                     <CartPayment products={cartItems?.data?.products && cartItems?.data?.products}
                        buyBtnHandler={buyBtnHandler} step={step} isStock={products && products.length > 0 ? true : false}></CartPayment>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
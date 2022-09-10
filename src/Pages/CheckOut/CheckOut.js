import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { cartCalculate } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { loggedOut } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';
import CartAddress from '../../Shared/CartComponents/CartAddress';

const CheckOut = () => {
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { authLoading, authRefetch, userInfo } = useAuthContext();
   const [step, setStep] = useState(false);

   // filter the products which stock is available
   let products = userInfo?.myCartProduct && userInfo?.myCartProduct.filter(p => p?.stock === "in");

   // pick the address where selected address is true
   const selectedAddress = userInfo && userInfo.address && userInfo?.address.find(a => a?.select_address === true);

   const buyBtnHandler = async (e) => {
      e.preventDefault();

      if ((products.length <= 0 || !step)) {
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/order/set-order/`, {
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

            if ((response.status === 401) || (response.status === 403)) {
               await loggedOut();
               navigate(`/login?err=${resData?.error}`);
            }

            if (response.status >= 200 && response.status <= 299) {
               authRefetch();
               navigate(`/my-profile/my-order?order=${resData?.message}`);
            } else {
               setMessage(resData?.error);
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
                  <div>
                     <CartAddress setMessage={setMessage} navigate={navigate} authRefetch={authRefetch} addr={userInfo?.address ? userInfo?.address : []} setStep={setStep} />
                  </div>
                  <br />
                  <div className="cart_card">
                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row">
                        {
                           userInfo?.myCartProduct && userInfo?.myCartProduct.filter(p => p?.stock === "in").map((userInfo, index) => {
                              return (
                                 <CartItem cartTypes={"toCart"} checkOut={true} product={userInfo} key={index}></CartItem>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartCalculation product={cartCalculate(userInfo?.myCartProduct)} headTitle={"Order Details"}></CartCalculation>
                  <br />
                  <CartPayment buyBtnHandler={buyBtnHandler} step={step} isStock={products && products.length > 0 ? true : false}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
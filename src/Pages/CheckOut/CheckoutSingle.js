import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { useAuthContext } from '../../lib/AuthProvider';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import { useEffect } from 'react';
import { useMessage } from '../../Hooks/useMessage';

const CheckoutSingle = () => {
   const navigate = useNavigate();
   const { userInfo, authLoading, authRefetch } = useAuthContext();
   const [step, setStep] = useState(false);
   const [data, setData] = useState({});
   const { state } = useLocation();
   const [productData, setProductData] = useState(state || {});
   const { msg, setMessage } = useMessage("");
   const [paymentMode, setPaymentMode] = useState("");

   const selectedAddress = userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress;

   useEffect(() => {

      if (!state) {
         return navigate('/', { replace: true });
      }

      const fetchData = setTimeout(() => {
         (async () => {

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/purchase`, {
               method: "POST",
               withCredential: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (result?.success) {
               setData(result?.data?.module);
            }
         })();
      }, 0);

      return () => clearTimeout(fetchData);
   }, [productData, navigate, state]);


   if (authLoading) return <Spinner></Spinner>


   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();

         let product = data?.product && data?.product;
         delete product["paymentInfo"];
         delete product["sellerData"];
         delete product["totalAmount"];
         delete product["sellingPrice"];
         delete product["shippingCharge"];
         product["shippingAddress"] = selectedAddress;
         product["paymentMode"] = paymentMode;
         product["state"] = "byPurchase";

         let p = [product];

         if (window.confirm("Buy Now")) {

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/set-order/`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  authorization: `${userInfo?.email}`
               },
               body: JSON.stringify(p)
            });

            const result = await response.json();

            if (response.status >= 200 && response.status <= 299) {
               if (result?.data) {

                  let data = result?.data && result?.data;

                  for (let i = 0; i < data.length; i++) {
                     let elem = data[i];

                     if (elem?.orderSuccess) {
                        setMessage(elem?.message, "success");
                        navigate(`/my-profile/my-order`);
                     } else {
                        setMessage(elem?.message, "danger");
                     }
                  }
               }

            }
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }


   window.history.replaceState({}, document.title);

   return (
      <div className='section_default'>
         <div className="container">
            {msg}
            <div className="mb-4">
               <Link to='/my-cart'> <FontAwesomeIcon icon={faLeftLong} /> Back To Cart</Link>
            </div>
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className='cart_card'>

                     <CartAddress
                        navigate={navigate}
                        authRefetch={authRefetch}
                        addr={userInfo && userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []}
                        setStep={setStep}
                     />

                     <br />
                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        {
                           <CartItem
                              cartType={"buy"}
                              checkOut={false}
                              state={productData}
                              setState={setProductData}
                              setMessage={setMessage}
                              product={data?.product && data?.product}
                           />
                        }
                     </div>

                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <div className="cart_card">

                     <CartCalculation
                        product={data?.container_p && data?.container_p}
                        headTitle={"Order Details"}
                     />

                     <br />

                     <CartPayment
                        step={step}
                        buyBtnHandler={buyBtnHandler}
                        paymentMode={paymentMode}
                        setPaymentMode={setPaymentMode}
                        isStock={data?.product ? true : false}
                        isAddress={selectedAddress ? true : false}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutSingle;
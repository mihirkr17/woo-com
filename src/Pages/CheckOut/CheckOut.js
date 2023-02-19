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
import { useCartContext } from '../../lib/CartProvider';

const CheckOut = () => {
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { authLoading, authRefetch, userInfo } = useAuthContext();
   const [step, setStep] = useState(false);
   const [paymentMode, setPaymentMode] = useState("");
   const { cartData, cartRefetch } = useCartContext();



   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();
         const selectedAddress = userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress;

         if (paymentMode === "") {
            return setMessage("Please select payment mode !", "danger");
         }
         if (!selectedAddress) {
            return setMessage("Please select shipping address.", "danger");
         }

         // let buyAlert = window.confirm("Buy Now");
         let products = cartData?.products && cartData?.products;

         if (Array.isArray(products)) {
            let newItems = [];

            for (let i = 0; i < products.length; i++) {
               let pElem = products[i];
               delete pElem["paymentInfo"];
               delete pElem["sellerData"];
               delete pElem["totalAmount"];
               delete pElem["sellingPrice"];
               delete pElem["shippingCharge"];
               delete pElem["paymentInfo"];
               pElem["shippingAddress"] = selectedAddress;
               pElem["paymentMode"] = paymentMode;
               pElem["state"] = "byCart";
               newItems.push(pElem);
            }

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/set-order/`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  authorization: `${userInfo?.email}`
               },
               body: JSON.stringify(newItems)
            });

            const result = await response.json();

            if (response.status >= 200 && response.status <= 299) {

               if (result?.data) {

                  let data = result?.data && result?.data;

                  for (let i = 0; i < data.length; i++) {
                     let elem = data[i];

                     if (elem?.orderSuccess) {
                        setMessage(elem?.message, "success");
                     } else {
                        setMessage(elem?.message, "danger");
                     }
                  }
               }
               // authRefetch();
               // return navigate(`/my-profile/my-order`);
            } else {
               return setMessage(result?.message, 'danger');
            }
         }
      } catch (error) {

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
                     <CartAddress setMessage={setMessage} navigate={navigate} cartRefetch={cartRefetch} authRefetch={authRefetch} addr={userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []} setStep={setStep} />
                     <br />

                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        {
                           Array.isArray(cartData?.products) && cartData?.products.filter(p => p?.stock === "in").map((product) => {
                              return (
                                 <CartItem
                                    cartType={"toCart"}
                                    checkOut={true}
                                    product={product}
                                    key={product?.variationID}
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
                     <CartCalculation
                        product={(cartData?.container_p && cartData?.container_p)}
                        headTitle={"Order Details"}
                     />

                     <br />

                     <CartPayment
                        paymentMode={paymentMode}
                        setPaymentMode={setPaymentMode}
                        products={cartData?.products && cartData?.products}
                        buyBtnHandler={buyBtnHandler}
                        step={step}
                        isStock={cartData?.products ? true : false}
                        isAddress={userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress ? true : false}
                     />


                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
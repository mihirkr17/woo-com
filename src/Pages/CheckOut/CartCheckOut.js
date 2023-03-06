import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const CartCheckOut = () => {
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { authLoading, authRefetch, userInfo } = useAuthContext();
   const { state } = useLocation();
   const [orderLoading, setOrderLoading] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);

   const stripe = useStripe();
   const elements = useElements();

   useEffect(() => {
      if (!state) {
         return navigate('/my-cart', { state: null, replace: true })
      };
   }, [state, navigate]);


   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();

         const selectedAddress = userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress;

         if (!selectedAddress) {
            return setMessage("Please select shipping address.", "danger");
         }

         if (!stripe || !elements) {
            return;
         }

         const card = elements.getElement(CardElement);

         if (card === null) {
            return;
         }

         // Use your card Element with other Stripe.js APIs
         const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });

         if (error) {
            return setMessage(error?.message, "danger")
         }

         let products = state?.products && state?.products;

         if (Array.isArray(products) && products.length >= 0 && paymentMethod) {

            setOrderLoading(true);

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/set-order/`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  authorization: `${userInfo?.email}`
               },
               body: JSON.stringify({ state: "byCart", paymentMethod })
            });

            const { clientSecret, orderPaymentID, orderItems } = await response.json();

            if (response.status >= 200 && response.status <= 299) {

               setOrderLoading(false);

               if (clientSecret && orderPaymentID && orderItems) {

                  const { paymentIntent, error: intErr } = await stripe.confirmCardPayment(
                     clientSecret,
                     {
                        payment_method: {
                           card: card,
                           billing_details: {
                              name: selectedAddress?.name,
                              email: userInfo?.email,
                              phone: selectedAddress?.phone_number,
                              address: {
                                 city: selectedAddress?.city,
                                 state: selectedAddress?.division,
                                 line1: selectedAddress?.area,
                                 line2: selectedAddress?.landmark,
                                 country: "BD"
                              }
                           },
                           metadata: {
                              order_id: orderPaymentID
                           },
                        },
                     },
                  );

                  if (intErr) {
                     return setMessage(intErr?.message, "danger");
                  }

                  if (paymentIntent?.id && paymentIntent?.payment_method && paymentIntent?.status === "succeeded") {
                     setMessage("Payment succeeded. Order confirming soon...", "success");
                     setConfirmLoading(true);
                     setOrderLoading(false);

                     const response2 = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/confirm-order`, {
                        method: "POST",
                        withCredentials: true,
                        credentials: "include",
                        headers: {
                           "Content-Type": "application/json",
                           authorization: clientSecret
                        },
                        body: JSON.stringify({
                           orderPaymentID: orderPaymentID,
                           paymentIntentID: paymentIntent?.id,
                           paymentMethodID: paymentIntent?.payment_method,
                           orderItems: orderItems
                        })
                     });

                     const { success } = await response2.json();

                     if (success) {

                        setConfirmLoading(false);

                        return navigate("/user/my-account/orders-management");
                     }
                  }
               }

            } else {
               setOrderLoading(false);
            }
         }
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }

   if (authLoading) {
      return <Spinner></Spinner>;
   }

   window.history.replaceState(null, document.title);

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
                     <CartAddress setMessage={setMessage} navigate={navigate} authRefetch={authRefetch} addr={userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []} />
                     <br />

                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        {
                           Array.isArray(state?.products) && state?.products.filter(p => p?.stock === "in").map((product) => {
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
                        product={(state?.container_p && state?.container_p)}
                        headTitle={"Order Details"}
                     />

                     <br />

                     <div className='p-1 d-flex align-items-center flex-column'>
                        <h6>Pay With Card</h6>
                        <form style={{
                           width: "100%"
                        }} onSubmit={buyBtnHandler}>
                           <div className="py-4">
                              <CardElement
                                 options={{
                                    style: {
                                       base: {
                                          iconColor: '#c4f0ff',
                                          color: '#000',
                                          fontWeight: '500',
                                          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                          fontSize: '16px',
                                          fontSmoothing: 'antialiased',
                                          ':-webkit-autofill': {
                                             color: '#fce88',
                                          },
                                          '::placeholder': {
                                             color: '#87BBFG',
                                          },
                                       },
                                       invalid: {
                                          color: '#9e2146',
                                       }
                                    }
                                 }}
                              />
                           </div>
                           {
                              !userInfo?.buyer?.defaultShippingAddress && <p>Please select shipping address.</p>
                           }

                           <button className='bt9_checkout' disabled={(state?.products && userInfo?.buyer?.defaultShippingAddress) ? false : true} type='submit'>
                              {
                                 orderLoading ? "Paying..." : confirmLoading ? "Confirming...." : "Pay Now " + parseInt(state?.container_p.finalAmounts && state?.container_p?.finalAmounts) + " Tk"
                              }
                           </button>
                        </form>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartCheckOut;
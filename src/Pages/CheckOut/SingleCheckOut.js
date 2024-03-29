import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import { useAuthContext } from '../../lib/AuthProvider';
import CartAddress from '../../Shared/CartComponents/CartAddress';
import { useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const SingleCheckOut = () => {
   const navigate = useNavigate();
   const { userInfo, authLoading, authRefetch, setMessage } = useAuthContext();
   const [data, setData] = useState({});
   const { state } = useLocation();
   const [productData, setProductData] = useState(state || {});
   const [orderLoading, setOrderLoading] = useState(false);

   const stripe = useStripe();
   const elements = useElements();

   const selectedAddress = userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress;

   useEffect(() => {

      if (!state) {
         return navigate('/', { replace: true });
      }

      const fetchData = setTimeout(() => {
         (async () => {

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/purchase`, {
               method: "POST",
               withCredentials: true,
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
         let clientSecret;
         let orderPaymentID;

         let product = data?.product ? data?.product : null;

         if (!product) {
            return setMessage("Please select product first", "danger");
         }

         if (!stripe || !elements) {
            return;
         }

         const card = elements.getElement(CardElement);

         if (!card) {
            return;
         }

         if (card === null) {
            return;
         }

         // Use your card Element with other Stripe.js APIs
         const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });


         if (error) {
            return setMessage(error?.message, "danger");
         }

         setOrderLoading(true);

         if (data?.container_p?.finalAmounts && paymentMethod) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/payment/create-payment-intent`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ totalAmount: parseInt(data?.container_p?.finalAmounts) })
            });

            const result = await response.json();

            if (response.ok) {
               clientSecret = result?.clientSecret;
               orderPaymentID = result?.orderPaymentID;

               if (clientSecret && orderPaymentID) {

                  const { paymentIntent, error } = await stripe.confirmCardPayment(
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

                  if (error) {
                     return setMessage(error?.message, "danger");
                  }

                  if (!paymentIntent?.id) {
                     return;
                  }

                  setOrderLoading(true);

                  const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/order/single-purchase`, {
                     method: "POST",
                     withCredentials: true,
                     credentials: "include",
                     headers: {
                        "Content-Type": "application/json",
                        authorization: `${userInfo?.email}`
                     },
                     body: JSON.stringify({
                        productID: product?.productID,
                        listingID: product?.listingID,
                        variationID: product?.variationID,
                        quantity: product?.quantity,
                        customerEmail: product?.customerEmail,
                        state: "byPurchase",
                        orderPaymentID,
                        paymentMethodID: paymentIntent?.payment_method,
                        paymentIntentID: paymentIntent?.id,
                     })
                  });

                  const result = await response.json();

                  if (response.status >= 200 && response.status <= 299) {
                     setOrderLoading(false);
                     if (result?.success) {
                        return navigate("/user/my-account/orders-management");
                     }
                  } else {
                     setOrderLoading(false);
                  }
               } else {
                  setOrderLoading(false);
                  return setMessage("Payment intent creation failed !", "danger");
               }
            } else {
               setOrderLoading(false);
               return setMessage(result?.message, "danger");
            }
         }
      } catch (error) {
         return setMessage(error?.message, "danger");
      } finally {
         setOrderLoading(false);
      }
   }


   window.history.replaceState(null, document.title);

   return (
      <div className='section_default'>
         <div className="container">
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

                           <button className='bt9_checkout' disabled={(data?.product && userInfo?.buyer?.defaultShippingAddress) ? false : true} type='submit'>
                              {
                                 orderLoading ? "Paying..." : "Pay Now "
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

export default SingleCheckOut;
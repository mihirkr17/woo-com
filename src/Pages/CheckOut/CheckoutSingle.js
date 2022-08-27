import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { cartCalculate, loggedOut } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { useAuthContext } from '../../lib/AuthProvider';

const CheckoutSingle = () => {
   const navigate = useNavigate();
   const { userInfo, authLoading } = useAuthContext();
   const product = userInfo && userInfo?.buy_product;

   if (authLoading) return <Spinner></Spinner>
   const selectedAddress = userInfo && userInfo?.address && userInfo?.address.find(a => a?.select_address === true); //finding selected address to checkout page

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);
      let trackingId = ("TR00" + orderId);
      let products = {
         orderId: orderId,
         trackingId,
         user_email: userInfo?.email,
         productId: product?._id,
         title: product?.title,
         slug: product?.slug,
         brand: product?.brand,
         image: product.image,
         sku: product?.sku,
         price: product?.price,
         totalAmount: product?.totalAmount,
         quantity: product?.quantity,
         seller: product?.seller,
         payment_mode: payment_mode,
         shipping_address: selectedAddress,
         package_dimension: product?.package_dimension,
         delivery_service: product?.delivery_service,
      }

      if (window.confirm("Buy Now")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/set-order/`, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: `${userInfo?.email}`
            },
            body: JSON.stringify({ ...products })
         });

         const resData = await response.json();

         // if (response.status === 400) {
         //    setMessage(resData?.message);
         //    return
         // }

         if (response.status >= 200 && response.status <= 299) {
            navigate(`/my-profile/my-order?order=${resData?.message}`);
         }

         if ((response.status === 401) || (response.status === 403)) {
            await loggedOut();
            navigate(`/login?err=${resData?.message} token not found`);
         }
      }
   }


   return (
      <div className='section_default'>
         <div className="container">
            <div className="mb-4">
               <Link to='/my-cart'> <FontAwesomeIcon icon={faLeftLong} /> Back To Cart</Link>
            </div>
            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div>
                     <address className='cart_card'>
                        <h6>Selected Address</h6>
                        <hr />
                        <div className="address_card">
                           {
                              <div style={{ wordBreak: "break-word" }}>
                                 <h6><b className='me-3'>{selectedAddress?.name}</b>{selectedAddress?.select_address && <FontAwesomeIcon icon={faCheckCircle} />}</h6>
                                 <p>
                                    <small>{selectedAddress?.village}, {selectedAddress?.city}, {selectedAddress?.country}, {selectedAddress?.zip}</small> <br />
                                    <small>Phone : {selectedAddress?.phone}</small>
                                 </p>
                              </div>
                           }
                        </div>
                     </address>
                  </div>
                  <br />
                  <div className="cart_card">
                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row">
                        {
                           <CartItem checkOut={true} cartTypes={"buy"} product={userInfo && userInfo?.buy_product}></CartItem>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartCalculation product={cartCalculate([userInfo && userInfo?.buy_product])} headTitle={"Order Details"}></CartCalculation>
                  <br />
                  <CartPayment buyBtnHandler={buyBtnHandler} isStock={userInfo && userInfo?.buy_product ? true : false}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutSingle;
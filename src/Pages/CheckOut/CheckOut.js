import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../App';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';

import { cartCalculate } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { commissionRate } from '../../Shared/commissionRate';
import { loggedOut } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';

const CheckOut = () => {
   const user = useAuthUser();
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { authLoading, userInfo } = useAuthContext();
   let products = userInfo?.myCartProduct && userInfo?.myCartProduct.filter(p => p?.stock === "in");

   if (authLoading) {
      return <Spinner></Spinner>;
   }

   const selectedAddress = userInfo && userInfo.address && userInfo?.address.find(a => a?.select_address === true); //finding selected address to checkout page

   const buyBtnHandler = async (e) => {
      e.preventDefault();

      if (products && products.length <= 0) {
         setMessage(<p className='text-danger'><small><strong>No Products to buy</strong></small></p>);
         return;
      }

      let buyAlert = window.confirm("Buy Now");
      let payment_mode = e.target.payment.value;

      for (let i = 0; i < products.length; i++) {
         let elem = products[i];
         let orderId = Math.floor(Math.random() * 1000000000);
         const { commission, commission_rate } = commissionRate(elem?.price, elem?.quantity);
         let trackingId = ("TR00" + orderId); 

         let product = {
            orderId: orderId,
            trackingId,
            user_email: userInfo?.email,
            owner_commission_rate: parseFloat(commission_rate.toFixed(2)),
            owner_commission: parseFloat(commission.toFixed(2)),
            productId: elem._id,
            title: elem.title,
            slug: elem?.slug,
            brand: elem?.brand,
            image: elem.image,
            sku: elem?.sku,
            quantity: elem.quantity,
            price: elem?.price,
            totalAmount: elem?.totalAmount,
            discount: elem.discount,
            seller: elem.seller,
            payment_mode: payment_mode,
            shipping_address: selectedAddress,
            package_dimension: elem?.package_dimension,
            delivery_service: elem?.delivery_service,
            status: "pending",
            time_pending: new Date().toLocaleString()
         }

         if (buyAlert) {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}set-order/${user?.email}`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ ...product })
            });

            if (response.status >= 200 && response.status <= 299) {
               const resData = await response.json();
               navigate(`/my-profile/my-order?order=${resData?.message}`);
            } else {
               await loggedOut();
            }
         }
      }

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
                  <CartPayment buyBtnHandler={buyBtnHandler} isStock={products && products.length > 0 ? true : false}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
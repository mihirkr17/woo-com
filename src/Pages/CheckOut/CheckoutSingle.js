import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser, useCart } from '../../App';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';

import { cartCalculate } from '../../Shared/common';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { commissionRate } from '../../Shared/commissionRate';

const CheckoutSingle = () => {
   
   const user = useAuthUser();
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();
   const { cart, cartLoading } = useCart();
   const product = cart && cart?.buy_product;

   if (cartLoading) return <Spinner></Spinner>
   const selectedAddress = cart && cart?.address && cart?.address.find(a => a?.select_address === true); //finding selected address to checkout page

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);
      let priceFixed = parseFloat(product?.price_fixed);
      let productQuantity = parseInt(product?.quantity);
      const { commission, commission_rate } = commissionRate(priceFixed, productQuantity)

      let products = {
         orderId: orderId,
         user_email: user?.email,
         owner_commission_rate: parseFloat(commission_rate.toFixed(2)),
         owner_commission: parseFloat(commission.toFixed(2)),
         _id: product._id,
         product_name: product.title,
         slug: product?.slug,
         brand: product?.brand,
         image: product.image,
         category: product.category,
         sub_category: product?.sub_category,
         quantity: product.quantity,
         price: product.price,
         price_fixed: product.price_fixed,
         price_total: product.price_total,
         price_total_amount: (parseFloat(product.price_fixed) * parseInt(product.quantity)),
         discount: product.discount,
         discount_amount_fixed: product.discount_amount_fixed,
         discount_amount_total: product.discount_amount_total,
         seller: product.seller,
         address:  selectedAddress,
         payment_mode: payment_mode,
         status: "pending",
         time_pending: new Date().toLocaleString()
      }

      if (window.confirm("Buy Now")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}set-order/${user?.email}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...products })
         });

         response.ok ? await response.json() && navigate(`/my-profile/my-order`) :
            setMessage(<strong className='text-danger'>Something went wrong!</strong>);
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
                           <CartItem checkOut={true} cartTypes={"buy"} product={cart && cart?.buy_product}></CartItem>
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartCalculation product={cartCalculate([cart && cart?.buy_product])} headTitle={"Order Details"}></CartCalculation>
                  <br />
                  <CartPayment buyBtnHandler={buyBtnHandler}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutSingle;
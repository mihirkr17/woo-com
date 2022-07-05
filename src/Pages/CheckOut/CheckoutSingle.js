import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { commissionRate } from '../../Shared/commissionRate';

const CheckoutSingle = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { productId } = useParams();
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();

   const { data: cart, loading } = useFetch(`${BASE_URL}my-cart-item/${productId}/${user?.email}`);

   if (loading) return <Spinner></Spinner>
   const selectedAddress = cart && cart?.address.find(a => a?.select_address === true); //finding selected address to checkout page

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);
      let priceFixed = parseFloat(cart?.product?.price_fixed);
      let productQuantity = parseInt(cart?.product?.quantity);
      const { commission, commission_rate } = commissionRate(priceFixed, productQuantity)

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


   return (
      <div className='section_default'>
         <div className="container">
            <div className="mb-4">
               <Link to='/my-cart'> <FontAwesomeIcon icon={faLeftLong} /> Back To Cart</Link>
            </div>
            {msg}
            <div className="row">
               <div className="col-lg-8">
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
                  <div className="cart_card mb-3">
                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row">
                        {
                           <CartItem checkOut={true} product={cart?.product}></CartItem>
                        }
                     </div>
                  </div>

                  <CartPayment buyBtnHandler={buyBtnHandler}></CartPayment>
               </div>
               <div className="col-lg-4">
                  <CartCalculation product={cartCalculate([cart?.product])} headTitle={"Order Details"}></CartCalculation>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutSingle;
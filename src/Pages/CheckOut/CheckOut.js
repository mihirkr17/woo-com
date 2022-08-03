import { faCheckCircle, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../App';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../Hooks/useMessage';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartCalculation from '../../Shared/CartComponents/CartCalculation';
import CartItem from '../../Shared/CartComponents/CartItem';
import CartPayment from '../../Shared/CartComponents/CartPayment';
import { commissionRate } from '../../Shared/commissionRate';

const CheckOut = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()
   const { loading, cart } = useCart();

   if (loading) {
      return <Spinner></Spinner>;
   }

   const selectedAddress = cart && cart.address && cart?.address.find(a => a?.select_address === true); //finding selected address to checkout page

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let buyAlert = window.confirm("Buy Now");
      let payment_mode = e.target.payment.value;
      let products = cart?.product && cart?.product.filter(p => p?.stock === "in");

      for (let i = 0; i < products.length; i++) {
         let elem = products[i];
         let orderId = Math.floor(Math.random() * 1000000000);
         const { commission, commission_rate } = commissionRate(elem?.price_fixed, elem?.quantity);

         let product = {
            orderId: orderId,
            user_email: user?.email,
            owner_commission_rate: parseFloat(commission_rate.toFixed(2)),
            owner_commission: parseFloat(commission.toFixed(2)),
            _id: elem._id,
            product_name: elem.title,
            slug: elem?.slug,
            brand: elem?.brand,
            image: elem.image,
            category: elem.category,
            sub_category: elem?.sub_category,
            quantity: elem.quantity,
            price: elem.price,
            price_fixed: elem.price_fixed,
            price_total: elem.price_total,
            price_total_amount: (parseFloat(elem.price_fixed) * parseInt(elem.quantity)),
            discount: elem.discount,
            discount_amount_fixed: elem.discount_amount_fixed,
            discount_amount_total: elem.discount_amount_total,
            seller: elem.seller,
            address: selectedAddress,
            payment_mode: payment_mode,
            status: "pending",
            time_pending: new Date().toLocaleString()
         }

         if (buyAlert) {
            const response = await fetch(`${BASE_URL}set-order/${user?.email}`, {
               method: "POST",
               headers: {
                  "content-type": "application/json"
               },
               body: JSON.stringify({ ...product })
            });

            response.ok ? await response.json() && navigate(`/my-profile/my-order`) :
               setMessage(<strong className='text-danger'>Something went wrong!</strong>);
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
                           cart?.product && cart?.product.filter(p => p?.stock === "in").map((cart, index) => {
                              return (
                                 <CartItem cartTypes={"toCart"} checkOut={true} product={cart} key={index}></CartItem>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <CartCalculation product={cartCalculate(cart?.product)} headTitle={"Order Details"}></CartCalculation>
                  <br />
                  <CartPayment buyBtnHandler={buyBtnHandler}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
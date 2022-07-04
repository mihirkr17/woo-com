import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';
import CartPayment from '../../Shared/CartComponents/CartPayment';

const CheckOut = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { cartId } = useParams();
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage()

   const { data, loading } = useFetch(`${BASE_URL}my-cart-items/${user?.email}`);

   if (loading) {
      return <Spinner></Spinner>;
   }

   const selectedAddress = data && data?.address.find(a => a?.select_address === true); //finding selected address to checkout page
   const calc = cartCalculate(data?.product);



   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let buyAlert = window.confirm("Buy Now");
      let payment_mode = e.target.payment.value;
      let products = data && data?.product;

      for (let i = 0; i < products.length; i++) {
         let elem = products[i];
         let orderId = Math.floor(Math.random() * 1000000000);
         let priceFixed = parseFloat(elem?.price_fixed);
         let productQuantity = parseInt(elem?.quantity);

         let commission = 0;
         let commission_rate = 0;

         if (priceFixed > 50) {
            commission = (priceFixed * 3) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else if (priceFixed > 100) {
            commission = (priceFixed * 6) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else if (priceFixed > 150) {
            commission = (priceFixed * 9) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else if (priceFixed > 200) {
            commission = (priceFixed * 12) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else if (priceFixed > 250) {
            commission = (priceFixed * 15) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else if (priceFixed > 300) {
            commission = (priceFixed * 18) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         } else {
            commission = (priceFixed * 1.5) / 100;
            commission_rate = commission;
            commission = commission * productQuantity;
         }

         let product = {
            orderId: orderId,
            user_email: user?.email,
            owner_commission_rate: parseFloat(commission_rate.toFixed(2)),
            owner_commission: parseFloat(commission.toFixed(2)),
            _id: elem._id,
            product_name: elem.title,
            image: elem.image,
            category: elem.category,
            quantity: elem.quantity,
            price: elem.price,
            price_fixed: elem.price_fixed,
            price_total: elem.price_total,
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
            <div className="row">
               <div className="col-lg-6">
                  <div className="total_product border">
                     <div className="bg-info px-3 d-flex align-items-center justify-content-between">
                        <h6 className='text-center py-2'>Selected Product ({calc?.totalQuantity})</h6>
                        <span>Amount : {calc?.totalAmount()}$</span>
                     </div>
                     <div className="row">
                        {
                           data && data?.product.map(p => {
                              return (
                                 <div className="col-12 d-flex flex-row px-4 py-2" key={p?._id}>
                                    <div>
                                       <img src={p?.image} alt="" width={50} height={50} />
                                    </div>
                                    <div className="p-2">
                                       <h6>{p?.title}</h6>
                                       <small>Qty : {p?.quantity}, Price : {p?.price_fixed}</small>
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
                  <address className='mt-3 border'>
                     <div className="bg-info px-3 d-flex align-items-center justify-content-between">
                        <h6 className='text-center py-2'>Selected Address</h6>
                     </div>
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
               <div className="col-lg-6">
                  <CartPayment buyBtnHandler={buyBtnHandler}></CartPayment>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckOut;
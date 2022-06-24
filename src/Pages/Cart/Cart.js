import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartAddress from '../../Components/Shared/CartAddress';
import CartHeader from '../../Components/Shared/CartHeader';
import CartItem from '../../Components/Shared/CartItem';
import CartPayment from '../../Components/Shared/CartPayment';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthUser } from '../../lib/UserProvider';
import "./Cart.css";

const Cart = () => {
   const user = useAuthUser();
   const { data, loading, refetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-cart-items/${user?.email}`);
   const { msg, setMessage } = useMessage();
   const [step, setStep] = useState(false);
   const navigate = useNavigate();

   if (loading) return <Spinner></Spinner>;

   let totalPrice = data?.product && data?.product.map(p => parseInt(p?.price) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0);
   let totalQuantity = data?.product && data?.product.map(p => p?.quantity).reduce((p, c) => p + c, 0);
   let discount = data?.product && data?.product.map(p => parseInt(p?.discount_amount_fixed) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0);
   let totalAmount = (totalPrice - discount).toFixed(2);

   const buyBtnHandler = async (e) => {
      e.preventDefault();

      let buyAlert = window.confirm("Buy Now");
      if (data?.address?.select_address === false) {
         setMessage(<strong className='text-danger'>Please Select Delivery Address!</strong>);
      } else if (data?.address === null) {
         setMessage(<strong className='text-danger'>Please Insert Address!</strong>);
      } else if (data?.product.length <= 0) {
         setMessage(<strong className='text-danger'>Select Atleast One Product For Order!</strong>);
      } else {
         let payment_mode = e.target.payment.value;

         let products = data && data?.product;

         for (let i = 0; i < products.length; i++) {
            let elem = products[i];
            let orderId = Math.floor(Math.random() * 1000000000);

            let product = {
               orderId: orderId,
               user_email: user?.email,
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
               address: data?.address && data?.address,
               payment_mode: payment_mode,
               status: "pending",
               time_pending: new Date().toLocaleString()
            }

            if (buyAlert) {
               const response = await fetch(`https://woo-com-serve.herokuapp.com/set-order/${user?.email}`, {
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
   }

   return (
      <div className='section_default'>
         <div className="container">
            <p><strong className='text-danger'>{msg}</strong></p>
            <div className="row">
               <div className="col-lg-8">
                  <div className="row">

                     <div className="col-12 mb-3">
                        <CartHeader user={user}></CartHeader>
                     </div>

                     <div className="col-12 my-3">
                        <h5>Total In Cart {data && data?.product.length}</h5>
                        {
                           data ? data?.product.map(product => {
                              return (
                                 <CartItem key={product?._id} user={user} product={product} refetch={refetch} setMessage={setMessage}></CartItem>
                              )
                           }) :
                              <div className="card_default">
                                 <div className="card_description">
                                    <h3 className="cart_title">No Product Available In Your Cart</h3>
                                 </div>
                              </div>
                        }
                     </div>

                  </div>

               </div>
               <div className="col-lg-4">
                  <div className="row">
                     <div className="col-12 mb-3">

                        <div className="card_default">
                           <div className="card_description">
                              <div className="text-truncate pb-2">Price Details</div>
                              <pre>Total Price({totalQuantity || 0}) : {Math.round(totalPrice) + " $" || 0}</pre>
                              <pre>Discount : -{discount + " $" || 0}</pre>
                              <hr />
                              <code>Total Amount : {totalAmount || 0}</code>
                           </div>
                        </div>
                     </div>
                     <div className="col-12 mb-3">
                        <CartAddress refetch={refetch} addr={data?.address ? data?.address : ""} user={user} step={step} setStep={setStep}></CartAddress>
                     </div>
                     <div className="col-12 mb-3">
                        <CartPayment buyBtnHandler={buyBtnHandler} dataProductLength={data?.product.length} selectAddress={data?.address?.select_address} ></CartPayment>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;
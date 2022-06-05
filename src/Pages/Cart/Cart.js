import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import CartAddress from '../../Components/Shared/CartAddress';
import CartHeader from '../../Components/Shared/CartHeader';
import CartItem from '../../Components/Shared/CartItem';
import CartPayment from '../../Components/Shared/CartPayment';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import "./Cart.css";

const Cart = () => {
   const [user] = useAuthState(auth);
   const { data, loading, refetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-cart-items/${user?.email}`);
   const { msg, setMessage } = useMessage();
   const [step, setStep] = useState(false);
   const navigate = useNavigate();

   if (loading) return <Spinner></Spinner>;


   let totalPrice = data?.product && data?.product.map(p => p?.total_price).reduce((p, c) => p + c, 0);
   let totalQuantity = data?.product && data?.product.map(p => p?.quantity).reduce((p, c) => p + c, 0);
   let discount = data?.product && data?.product.map(p => p?.total_discount).reduce((p, c) => p + c, 0);
   let totalAmount = (totalPrice - discount).toFixed(2);

   const buyBtnHandler = async (e) => {
      e.preventDefault();
      if (data?.address?.select_address === false) {
         setMessage(<strong className='text-danger'>Please Select Delivery Address!</strong>);
      } else if (data?.address === null) {
         setMessage(<strong className='text-danger'>Please Insert Address!</strong>);
      } else if (data?.product.length <= 0) {
         setMessage(<strong className='text-danger'>Select Atleast One Product For Order!</strong>);
      } else {
         let payment_mode = e.target.payment.value;
         let productArr = [];
         let orderId = Math.floor(Math.random() * 1000000000);

         let d = data && data?.product;
         for (let i = 0; i < d.length; i++) {
            let elem = d[i];
            let product = {
               product_name: elem.title,
               price: elem.price,
               image: elem.image,
               final_price: elem.final_price,
               quantity: elem.quantity,
               discount: elem.discount,
               _id: elem._id,
               total_price : elem.total_price,
               total_discount : elem.total_discount,
               category : elem.category
            }
            productArr.push(product);
         }

         let orderList = {
            user_email: user?.email,
            orderId: orderId,
            product: productArr,
            total_product: totalQuantity,
            total_amount: totalAmount,
            address: data?.address && data?.address,
            payment_mode: payment_mode,
            status: "pending",
            time_pending : new Date().toLocaleString()
         };

         if (window.confirm("Buy Now")) {
            const response = await fetch(`https://woo-com-serve.herokuapp.com/set-order/${user?.email}`, {
               method: "POST",
               headers: {
                  "content-type": "application/json"
               },
               body: JSON.stringify(orderList)
            });

            response.ok ? await response.json() && navigate(`/my-profile/my-order`) :
               setMessage(<strong className='text-danger'>Something went wrong!</strong>);
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
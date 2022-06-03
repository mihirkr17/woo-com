import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import CartAddress from '../../Components/Shared/CartAddress';
import CartHeader from '../../Components/Shared/CartHeader';
import CartItem from '../../Components/Shared/CartItem';
import CartPayment from '../../Components/Shared/CartPayment';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';

const Purchase = () => {
   const { productId } = useParams();
   const [user] = useAuthState(auth);

   const { data: cart, loading, refetch } = useFetch(`http://localhost:5000/my-cart-items/${user?.email}`);
   // const { data: cart2} = useFetch(`http://localhost:5000/my-cart-item/${productId}/${user?.email}`);
   const { msg, setMessage } = useMessage("");
   const navigate = useNavigate();
   const [step, setStep] = useState(false);

   if (msg !== '') return navigate('/');
   if (loading) return <Spinner></Spinner>;


   let product = cart && cart?.product && cart?.product.find(p => p._id === productId);
   let totalPrice = product && parseInt(product?.total_price);
   let totalQuantity = product && product?.quantity;
   let discount = product && parseInt(product?.total_discount);
   let totalAmount = (totalPrice - discount).toFixed(2);

   // console.log(cart2);


   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);

      let order = {
         user_email: user?.email,
         orderId: orderId,
         product: [product],
         total_product: totalQuantity,
         total_amount: totalAmount,
         address: cart?.address && cart?.address,
         payment_mode: payment_mode,
         status: "pending"
      };

      if (window.confirm("Buy Now")) {
         const response = await fetch(`http://localhost:5000/set-order/${user?.email}`, {
            method: "POST",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify(order)
         });

         response.ok ? await response.json() && navigate(`/my-profile/my-order`) :
            setMessage(<strong className='text-danger'>Something went wrong!</strong>);
      }
   }

   return (
      <div className='section_default'>
         {msg}
         <div className="container">
            <div className="row">
               <div className="col-lg-8">
                  <div className="row">


                     <div className="col-12 mb-3">
                        <CartHeader user={user}></CartHeader>
                     </div>

                     <div className="col-12 my-3">
                        <CartItem product={product} refetch={refetch} user={user} setMessage={setMessage}></CartItem>
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
                     <div className="col-12 my-3">
                        <CartAddress refetch={refetch} user={user} addr={cart?.address ? cart?.address : {}} step={step} setStep={setStep}></CartAddress>
                     </div>
                     <div className="col-12 my-3">
                        <CartPayment buyBtnHandler={buyBtnHandler} dataProductLength={1} selectAddress={cart?.address?.select_address} ></CartPayment>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );

};

export default Purchase;
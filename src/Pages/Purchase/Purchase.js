import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CartAddress from '../../Components/Shared/CartAddress';
import CartHeader from '../../Components/Shared/CartHeader';
import CartItem from '../../Components/Shared/CartItem';
import CartPayment from '../../Components/Shared/CartPayment';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthUser } from '../../lib/UserProvider';

const Purchase = () => {
   const { productId } = useParams();
   const user = useAuthUser();

   const { data: cart, loading, refetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-cart-items/${user?.email}`);
   const { data: cart2 } = useFetch(`https://woo-com-serve.herokuapp.com/my-cart-item/${productId}/${user?.email}`);
   const { msg, setMessage } = useMessage("");
   const navigate = useNavigate();
   const [step, setStep] = useState(false);

   if (msg !== '') return navigate('/');
   if (loading) return <Spinner></Spinner>;
   // console.log(cart2);


   let product = cart && cart?.product && cart?.product.find(p => p._id === productId);
   let totalPrice = product && parseInt(product?.total_price);
   let totalQuantity = product && product?.quantity;
   let discount = product && parseInt(product?.total_discount);
   let totalAmount = (totalPrice - discount).toFixed(2);


   const buyBtnHandler = async (e) => {
      e.preventDefault();
      let payment_mode = e.target.payment.value;
      let orderId = Math.floor(Math.random() * 1000000000);

      let pp = {
         product_name: product.title,
         price: product.price,
         image: product.image,
         final_price: product.final_price,
         quantity: product.quantity,
         discount: product.discount,
         _id: product._id,
         total_price: product.total_price,
         total_discount: product.total_discount,
         category : product.category
      }

      let order = {
         user_email: user?.email,
         orderId: orderId,
         product: [pp],
         total_product: totalQuantity,
         total_amount: totalAmount,
         address: cart?.address && cart?.address,
         payment_mode: payment_mode,
         status: "pending",
         time_pending: new Date().toLocaleString()
      };

      if (window.confirm("Buy Now")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/set-order/${user?.email}`, {
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
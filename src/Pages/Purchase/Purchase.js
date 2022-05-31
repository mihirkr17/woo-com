import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import CartAddress from '../../Components/Shared/CartAddress';
import CartHeader from '../../Components/Shared/CartHeader';
import CartItem from '../../Components/Shared/CartItem';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';
import { useMessage } from '../../Hooks/useMessage';

const Purchase = () => {
   const { productId } = useParams();
   const [user] = useAuthState(auth);

   const { data: cart, loading: pLoading, refetch } = useFetch(`http://localhost:5000/my-cart-items/${user?.email}`);
   // const { data: addr, loading: addrLoading, refetch: addrRefetch } = useFetch(`http://localhost:5000/cart-address/${user?.email}`);
   const { msg, setMessage } = useMessage("");
   const navigate = useNavigate();

   if (msg !== '') {
      navigate('/');
   }

   if (pLoading) {
      return <Spinner></Spinner>;
   }
   let product;

   if (cart) {
      product = cart?.product && cart?.product.find(p => p._id === productId);
   }

   return (
      <div className='section_default'>
         {msg}
         <div className="container">
            <div className="row">
               <div className="col-lg-8">
                  <div className="row">
                     <div className="col-12 my-3">
                        <CartAddress refetch={refetch} user={user} addr={cart?.address ? cart?.address : {}}></CartAddress>
                     </div>

                     <div className="col-12 my-3">
                        <CartItem product={product} refetch={refetch} user={user} setMessage={setMessage}></CartItem>
                     </div>
                  </div>
               </div>
               <div className="col-lg-4">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <div className="text-truncate">Price Details</div>
                        <div className="card_default">
                           <div className="card_description">
                              <h3>Total Price({product?.quantity}) : {Math.round(product?.total_price)}</h3>
                           </div>
                        </div>
                     </div>
                     <div className="col-12 mb-3">
                        <CartHeader user={user}></CartHeader>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );

};

export default Purchase;
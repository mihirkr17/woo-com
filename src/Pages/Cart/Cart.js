import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';
import "./Cart.css";

const Cart = () => {
   const [user] = useAuthState(auth);
   const { data, loading, refetch } = useFetch(`http://localhost:5000/my-cart-items/${user?.email}`);

   if (loading) {
      <Spinner></Spinner>;
   }

   const quantityHandler = async (product, params) => {

      let quantity;

      if (params === "dec") {
         quantity = product?.quantity - 1;
      } else if (params === "inc") {
         quantity = product?.quantity + 1;
      }

      let price = parseInt(product?.price) * parseInt(quantity);

      const response = await fetch(`http://localhost:5000/update-cart/${product?._id}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ quantity, total_price: price })
      })

      const resData = await response.json();

      if (resData) {
         refetch();
      }

   }


   if (data.length > 0) {

      let totalPrice = data.map(p => p?.total_price);
      totalPrice = totalPrice.reduce((p, c) => p + c);


      return (
         <div className='section_default'>
            <div className="container">
               <div className="row">
                  <div className="col-lg-8">
                     <div className="row">
                        {
                           data.map(product => {
                              return (
                                 <div className="col-12 my-3" key={product._id}>
                                    <div className="card_default cart">
                                       <div className="cart_img">
                                          <img src={product.image} alt="" />
                                          <div className="cart_btn">
                                             <button className='btn btn-sm btn-primary' disabled={product?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(product, "dec")}>-</button>
                                             <input type="text" className='form-control' key={product?.quantity} defaultValue={product?.quantity} name="counter" id="counter" />
                                             <button className='btn btn-sm btn-primary' onClick={(e) => quantityHandler(product, "inc")}>+</button>
                                          </div>
                                       </div>
                                       <div className="card_description">
                                          <div className="card_title">{product.title}</div>
                                       </div>
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
                  <div className="col-lg-4">
                     <div className="text-truncate">Price Details</div>
                     <div className="card_default">
                        <div className="card_description">
                           <h3>Total Price : {totalPrice}</h3>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }


};

export default Cart;
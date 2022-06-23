import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ product: cart, refetch, setMessage, user, loading }) => {

   const quantityHandler = async (cart, params) => {

      let quantity = params === "dec" ? cart?.quantity - 1 : cart?.quantity + 1;

      let price = parseInt(cart?.price) * parseInt(quantity);
      let discount_amount_total = parseInt(cart?.discount_amount_fixed) * parseInt(quantity);

      const response = await fetch(`https://woo-com-serve.herokuapp.com/up-cart-qty-ttl-price/${cart?._id}/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ quantity, price_total : price, discount_amount_total })
      })

      if (response.ok) await response.json(); refetch();
   }

   const removeItemFromCartHandler = async (cart) => {
      const { _id, title } = cart;

      if (window.confirm("Want to remove this item from your cart ?")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/delete-cart-item/${_id}/${user?.email}`, {
            method: "DELETE"
         });

         if(response.ok) await response.json();
         setMessage(`Successfully remove ${title} from your cart`);
         refetch();
      }
   }

   return (

      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               <img src={cart?.image} alt="" />
            </div>
            <div className="ms-2 cart_btn">
               <button className='badge bg-primary my-1' disabled={cart?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(cart, "dec")}>-</button>
               <span className='border px-2'>{cart?.quantity} </span>
               <button className='badge bg-primary my-1' onClick={(e) => quantityHandler(cart, "inc")}>+</button>
            </div>
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">

               <div className="row">
                  <div className="col-11">
                     <p className="card_title"><Link to={`/product/${cart?._id}`}>{cart?.title}</Link></p>
                     <small>
                        <strike className='text-muted'>{cart?.price}</strike>&nbsp;
                        <big className='text-success'>{cart?.price_fixed}$</big>&nbsp;{cart?.discount + "% Off"}
                     </small>
                  </div>
                  <div className="remove_btn col-1 text-end">
                     <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cart)}><FontAwesomeIcon icon={faClose} /></button>
                  </div>
               </div>
            </div>

         </div>
      </div>

   );
};

export default CartItem;
import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ product: cart, refetch, setMessage, user }) => {

   const quantityHandler = async (cart, params) => {
      let quantity;

      if (params === "dec") {
         quantity = cart?.quantity - 1;
      } else if (params === "inc") {
         quantity = cart?.quantity + 1;
      }

      let price = parseInt(cart?.price) * parseInt(quantity);
      let finalDiscount = parseInt(cart?.final_discount) * parseInt(quantity);

      const response = await fetch(`http://localhost:5000/up-cart-qty-ttl-price/${cart?._id}/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ quantity, total_price: price, total_discount: finalDiscount })
      })

      const resData = await response.json();

      if (resData) {
         refetch();
      }

   }

   const removeFromCartHandler = async (cart) => {
      const { _id, title } = cart;
      let confirmMsg = window.confirm("Want to remove this item from your cart ?");
      if (confirmMsg) {
         const response = await fetch(`http://localhost:5000/delete-cart-item/${_id}/${user?.email}`, {
            method: "DELETE"
         });

         if (response.ok) {
            const resData = await response.json();
            if (resData) {
               setMessage(`Successfully remove ${title} from your cart`);
               refetch();
            }
         }
      }
   }

   return (

      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               <img src={cart?.image} alt="" />
            </div>
            <div className="ms-2 cart_btn">
               <button className='btn btn-sm btn-primary my-1' disabled={cart?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(cart, "dec")}>-</button>
               <input type="text" disabled className='form-control form-control-sm' style={{ width: '40px' }} key={cart?.quantity} defaultValue={cart?.quantity} name="counter" id="counter" />
               <button className='btn btn-sm btn-primary  my-1' onClick={(e) => quantityHandler(cart, "inc")}>+</button>
            </div>
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">
               <p className="card_title"><Link to={`/product/${cart?._id}`}>{cart?.title}</Link></p>
               <small>
                  <strike className='text-muted'>{cart?.price}</strike>&nbsp;
                  <big className='text-success'>{cart?.final_price}$</big>&nbsp;{cart?.discount + "% Off"}
               </small>
            </div>
            <div className="remove_btn col-12 text-end">
               <button className='btn btn-sm btn-danger' onClick={() => removeFromCartHandler(cart)}>Remove</button>
            </div>
         </div>
      </div>

   );
};

export default CartItem;
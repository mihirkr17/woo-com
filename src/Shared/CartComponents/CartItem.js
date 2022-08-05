import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

import { loggedOut } from '../common';

const CartItem = ({ product: cartProduct, setMessage, refetch, user, checkOut, cartTypes }) => {
   

   // update product quantity handler
   const quantityHandler = async (cp, action) => {
      let quantity = action === "dec" ? cp?.quantity - 1 : cp?.quantity + 1;
      let price = parseInt(cp?.price) * parseInt(quantity);
      let discount_amount_total = parseInt(cp?.discount_amount_fixed) * parseInt(quantity);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/update-product-quantity/${cp?._id}/${cartTypes && cartTypes}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ quantity, price_total: price, discount_amount_total })
      })

      if (response.ok) {
         refetch();
      } else {
         await loggedOut();
      }
   }

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { _id, title } = cp;

      if (window.confirm("Want to remove this item from your cart ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}delete-cart-item/${_id}/${cartTypes && cartTypes}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
         });

         if (response.ok) {
            const resData = await response.json();

            if (resData) {
               setMessage(`${title} ${resData?.message}`);
               refetch();
            };
         } else {
            await loggedOut();
         }
      }
   }

   return (
      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               <img src={cartProduct && cartProduct?.image} alt="" />
            </div>
            {
               !checkOut && <div className="ms-2 cart_btn">
                  <button className='badge bg-primary my-1' disabled={cartProduct && cartProduct?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(cartProduct && cartProduct, "dec")}>-</button>
                  <span className='border px-2'>{cartProduct && cartProduct?.quantity} </span>
                  <button className='badge bg-primary my-1' disabled={cartProduct && cartProduct?.quantity >= cartProduct && cartProduct?.available ? true : false} onClick={(e) => quantityHandler(cartProduct && cartProduct, "inc")}>+</button>
               </div>
            }
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">
               <div className="row">
                  <div className="col-11">
                     <p className="card_title"><Link to={`/product/${cartProduct && cartProduct?._id}`}>{cartProduct && cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between">
                        <small>
                           <strike className='text-muted'>{cartProduct && cartProduct?.price}</strike>&nbsp;
                           <big className='text-success'>{cartProduct && cartProduct?.price_fixed}$</big>&nbsp;{cartProduct && cartProduct?.discount + "% Off"}
                        </small>
                        <small className="text-muted">Qty : {cartProduct && cartProduct?.quantity}</small>
                        <small className="text-muted">Seller : {cartProduct && cartProduct?.seller}</small>
                        <small className="text-muted"> Stock : {cartProduct && cartProduct?.stock}({cartProduct && cartProduct?.available})</small>
                     </div>
                  </div>
                  {
                     !checkOut && <div className="remove_btn col-1 text-end">
                        <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cartProduct && cartProduct)}><FontAwesomeIcon icon={faClose} /></button>
                     </div>
                  }
               </div>
            </div>
         </div>
      </div>

   );
};

export default CartItem;
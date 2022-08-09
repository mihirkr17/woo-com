import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';

import { loggedOut } from '../common';

const CartItem = ({ product: cartProduct, setMessage, refetch, checkOut, cartTypes, cartLoading , navigate}) => {

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
      const resData = await response.json();

      if (response.ok) {
         refetch();
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
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

         const resData = await response.json();
         if (response.ok) {
            if (resData) {
               setMessage(`${title} ${resData?.message}`);
               refetch();
            };
         } else {
            await loggedOut();
            navigate(`/login?err=${resData?.message} token not found`);
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
                  <button className='badge bg-primary my-1' disabled={cartProduct && cartProduct?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(cartProduct && cartProduct, "dec")}>
                     {cartLoading ? <BtnSpinner /> : "-"}
                  </button>
                  <span className='border px-2'>{cartProduct && cartProduct?.quantity} </span>
                  <button className='badge bg-primary my-1' disabled={cartProduct && cartProduct?.quantity >= cartProduct && cartProduct?.available ? true : false} onClick={(e) => quantityHandler(cartProduct && cartProduct, "inc")}>
                     {cartLoading ? <BtnSpinner /> : "+"}
                  </button>
               </div>
            }
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">
               <div className="row">
                  <div className="col-11">
                     <p className="card_title"><Link to={`/${cartProduct?.category}/${cartProduct?.sub_category}/${cartProduct?.slug}`}>{cartProduct && cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between flex-wrap">
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
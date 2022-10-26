import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { apiHandler, authLogout } from '../common';
import ConfirmDialog from '../ConfirmDialog';

const CartItem = ({ product: cartProduct, setMessage, refetch, checkOut, cartTypes }) => {
   const [openBox, setOpenBox] = useState(false);

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { productId, title } = cp;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/cart/delete-cart-item/${cartTypes && cartTypes}`, {
         method: "DELETE",
         withCredential: true,
         credentials: 'include',
         headers: {
            authorization: productId
         }
      });

      const resData = await response.json();


      if (response.ok) {
         setMessage(`${title} ${resData?.message}`, 'success');
         refetch();
      } else {
         setMessage(`${title} ${resData?.error}`, 'danger');
      }
   }


   const itemQuantityHandler = async (value, productId, cartId) => {

      let quantity = parseInt(value);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/cart/update-cart-product-quantity`, {
         method: "PUT",
         withCredential: true,
         credentials: 'include',
         headers: {
            "Content-Type": "application/json",
            authorization: productId
         },
         body: JSON.stringify({
            actionRequestContext: {
               pageUri: '/my-cart',
               type: cartTypes,
               pageNumber: 1
            },
            upsertRequest: {
               cartContext: {
                  productId, quantity: quantity, cartId
               }
            }
         })
      });

      const resData = await response.json();

      if (response.ok) {
         refetch();
         return setMessage(resData?.message, 'success');
      }

      
      if (response.status === 401) {
         window.location.reload();
      }
      
      return setMessage(resData?.error, 'danger');
   }

   return (
      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               <img src={cartProduct && cartProduct?.image} alt="" />
            </div>
            {
               !checkOut &&
               <div className="ms-2 cart_btn">

                  <button
                     className='badge bg-primary my-1'
                     disabled={cartProduct && cartProduct?.quantity <= 1 ? true : false}
                     onClick={() => itemQuantityHandler(parseInt(cartProduct?.quantity) - 1, cartProduct?.productId, cartProduct?._id)}>
                     -
                  </button>

                  <input
                     className='border px-2' type="number"
                     value={cartProduct?.quantity || 0}
                     onChange={(e) => itemQuantityHandler(e.target.value, cartProduct?.productId, cartProduct?._id)}
                     maxLength='3'
                     style={{ width: '50px' }}
                  />

                  <button
                     className='badge bg-primary my-1'
                     disabled={cartProduct && cartProduct?.quantity >= cartProduct && cartProduct?.available ? true : false}
                     onClick={(e) => itemQuantityHandler(parseInt(cartProduct?.quantity) + 1, cartProduct?.productId, cartProduct?._id)}>
                     +
                  </button>
               </div>
            }
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">
               <div className="row">
                  <div className="col-11">
                     <p className="card_title"><Link to={`/product/${cartProduct?.slug}`}>{cartProduct && cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="product_price_model">
                           <big>{cartProduct?.price} TK</big>
                        </div>
                        {
                           // (cartProduct && cartProduct?.size) && <small className="text-muted">Size : {cartProduct && cartProduct?.size}</small>
                        }
                        <small className="text-muted">Qty : {cartProduct && cartProduct?.quantity}</small>
                        <small className="text-muted">Seller : {cartProduct && cartProduct?.seller}</small>
                        <small className="text-muted">Stock : {cartProduct && cartProduct?.stock}</small>
                     </div>
                  </div>
                  {
                     !checkOut && <div className="remove_btn col-1 text-end">
                        <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cartProduct)}><FontAwesomeIcon icon={faClose} /></button>
                        {
                           openBox && <ConfirmDialog payload={{
                              reference: cartProduct, openBox, setOpenBox,
                              handler: removeItemFromCartHandler, types: "Delete", text: `Remove this from your cart`
                           }} />
                        }
                     </div>
                  }
               </div>
            </div>
         </div>
      </div>

   );
};

export default CartItem;
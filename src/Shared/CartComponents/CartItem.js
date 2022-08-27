import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { apiHandler, loggedOut } from '../common';
import ConfirmDialog from '../ConfirmDialog';

const CartItem = ({ product: cartProduct, setMessage, authRefetch, checkOut, cartTypes, cartLoading, navigate }) => {
   const [openBox, setOpenBox] = useState(false);

   // update product quantity handler
   const quantityHandler = async (cp, action) => {
      let quantity = action === "dec" ? cp?.quantity - 1 : cp?.quantity + 1;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/update-product-quantity/${cartTypes && cartTypes}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            authorization: `${cp?._id}` || ""
         },
         body: JSON.stringify({ quantity })
      });

      const resData = await response.json();

      if (response.status === 400) {
         setMessage(resData?.message);
         return
      }

      if (response.ok) {
         authRefetch();
         setMessage(resData?.message);
      }

      if ((response.status === 401) || (response.status === 403)) {
         await loggedOut();
         navigate(`/login?err=Something went wrong`);
      }
   }

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { _id, title } = cp;

      const resData = await apiHandler(`${process.env.REACT_APP_BASE_URL}delete-cart-item/${cartTypes && cartTypes}`, "DELETE", `${_id}`);

      if (resData) {
         setMessage(`${title} ${resData?.message}`);
         authRefetch();
      } else {
         await loggedOut();
         navigate(`/login?err=Something went wrong`);
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
                     <p className="card_title"><Link to={`/product/${cartProduct?.slug}`}>{cartProduct && cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="product_price_model">
                           <big>{cartProduct?.price} TK</big>
                        </div>
                        {
                           (cartProduct && cartProduct?.size) && <small className="text-muted">Size : {cartProduct && cartProduct?.size}</small>
                        }
                        <small className="text-muted">Qty : {cartProduct && cartProduct?.quantity}</small>
                        <small className="text-muted">Seller : {cartProduct && cartProduct?.seller}</small>
                        <small className="text-muted">Stock : {cartProduct && cartProduct?.stock}</small>
                     </div>
                  </div>
                  {
                     !checkOut && <div className="remove_btn col-1 text-end">
                        <button className='btn btn-sm' onClick={() => setOpenBox(true)}><FontAwesomeIcon icon={faClose} /></button>
                        {
                           openBox && <ConfirmDialog payload={{ reference: cartProduct, openBox, setOpenBox, handler: removeItemFromCartHandler }} />
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
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { apiHandler, loggedOut } from '../common';

const CartItem = ({ product: cartProduct, setMessage, refetch, checkOut, cartTypes, cartLoading, navigate }) => {

   // update product quantity handler
   const quantityHandler = async (cp, action) => {
      let quantity = action === "dec" ? cp?.quantity - 1 : cp?.quantity + 1;
      let price = parseInt(cp?.price) * parseInt(quantity);
      let discount_amount_total = parseInt(cp?.discount_amount_fixed) * parseInt(quantity);
      const url = `${process.env.REACT_APP_BASE_URL}api/update-product-quantity/${cartTypes && cartTypes}`;
      const body = { quantity, price_total: price, discount_amount_total };

      const resData = await apiHandler(url, "PUT", `${cp?._id}`, body);

      if (resData) {
         refetch();
      } else {
         await loggedOut();
         navigate(`/login?err=Something went wrong`);
      }
   }

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { _id, title } = cp;
      const url = `${process.env.REACT_APP_BASE_URL}delete-cart-item/${cartTypes && cartTypes}`;

      if (window.confirm("Want to remove this item from your cart ?")) {
         const resData = await apiHandler(url, "DELETE", `${_id}`);

         if (resData) {
            setMessage(`${title} ${resData?.message}`);
            refetch();
         } else {
            await loggedOut();
            navigate(`/login?err=Something went wrong`);
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
                     <p className="card_title"><Link to={`/product/${cartProduct?.slug}`}>{cartProduct && cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <small>
                           <strike className='text-muted'>{cartProduct && cartProduct?.price}</strike>&nbsp;
                           <big className='text-success'>{cartProduct && cartProduct?.price_fixed} TK </big>&nbsp;{cartProduct && cartProduct?.discount + "% Off"}
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
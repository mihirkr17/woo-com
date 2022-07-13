import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../Hooks/useFetch';
import { useBASE_URL } from '../../lib/BaseUrlProvider';

const CartItem = ({ product: cartProduct, refetch, setMessage, user, checkOut }) => {
   const BASE_URL = useBASE_URL();
   const { data: product } = useFetch(user && `${BASE_URL}api/fetch-single-product/${cartProduct?._id}/${user?.email}`);

   // update the cartProduct product status by product 
   useEffect(() => {
      user && (async () => {
         let quantity = cartProduct?.quantity;
         let productPrice = parseInt(product?.price);
         let discount_amount_fixed = parseFloat(product?.discount_amount_fixed)
         let discount_amount_total = discount_amount_fixed * quantity;
         let discount = parseInt(product?.discount);
         let price_total = (productPrice * quantity) - discount_amount_total;
         let price_fixed = product?.price_fixed;
         let stock = product?.stock;
         let available = product?.available;
         let modifiedAt = product?.modifiedAt;

         const response = await fetch(user?.email && `${BASE_URL}api/update-cart-items/${user?.email}/${cartProduct?._id}`, {
            method: "PUT",
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify({
               quantity, price: productPrice, discount_amount_fixed,
               discount_amount_total, discount, price_total, price_fixed,
               stock, available, modifiedAt
            })
         });

         if (response.ok) await response.json();
      })();
   }, [user, product, cartProduct, BASE_URL])


   // update product quantity handler
   const quantityHandler = async (cp, action) => {

      let quantity = action === "dec" ? cp?.quantity - 1 : cp?.quantity + 1;

      let price = parseInt(cp?.price) * parseInt(quantity);
      let discount_amount_total = parseInt(cp?.discount_amount_fixed) * parseInt(quantity);

      const response = await fetch(`${BASE_URL}api/update-product-quantity/${cp?._id}/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ quantity, price_total: price, discount_amount_total })
      })

      if (response.ok) { await response.json(); refetch() };
   }


   //  Remove product from cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { _id, title } = cp;

      if (window.confirm("Want to remove this item from your cart ?")) {
         const response = await fetch(`${BASE_URL}delete-cart-item/${_id}/${user?.email}`, {
            method: "DELETE"
         });

         const resData = response.ok && await response.json();
         setMessage(`${title} ${resData?.message}`);
         refetch();
      }
   }

   return (
      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               <img src={cartProduct?.image} alt="" />
            </div>
            {
               !checkOut && <div className="ms-2 cart_btn">
                  <button className='badge bg-primary my-1' disabled={cartProduct?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(cartProduct, "dec")}>-</button>
                  <span className='border px-2'>{cartProduct?.quantity} </span>
                  <button className='badge bg-primary my-1' disabled={cartProduct?.quantity >= cartProduct?.available ? true : false} onClick={(e) => quantityHandler(cartProduct, "inc")}>+</button>
               </div>
            }

         </div>

         <div className="row w-100 card_description">
            <div className="col-12">

               <div className="row">
                  <div className="col-11">
                     <p className="card_title"><Link to={`/product/${cartProduct?._id}`}>{cartProduct?.title}</Link></p>
                     <div className="d-flex align-items-center justify-content-between">
                        <small>
                           <strike className='text-muted'>{cartProduct?.price}</strike>&nbsp;
                           <big className='text-success'>{cartProduct?.price_fixed}$</big>&nbsp;{cartProduct?.discount + "% Off"}
                        </small>
                        <small className="text-muted">Qty : {cartProduct?.quantity}</small>
                        <small className="text-muted"> Stock : {cartProduct?.stock}({cartProduct?.available})</small>
                     </div>
                  </div>
                  {
                     !checkOut && <div className="remove_btn col-1 text-end">
                        <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cartProduct)}><FontAwesomeIcon icon={faClose} /></button>
                     </div>
                  }
               </div>
            </div>

         </div>
      </div>

   );
};

export default CartItem;
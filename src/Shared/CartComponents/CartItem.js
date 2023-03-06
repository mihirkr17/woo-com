import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog';

const CartItem = ({ product: cartProduct, setMessage, cartRefetch, checkOut, cartType, state, setState, cartQtyUpdater, items }) => {
   const [openBox, setOpenBox] = useState(false);
   const [qtyLoading, setQtyLoading] = useState(false);

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      const { productID, title } = cp;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/cart/delete-cart-item/${cartType && cartType}`, {
         method: "DELETE",
         withCredentials: true,
         credentials: 'include',
         headers: {
            authorization: productID
         }
      });

      const resData = await response.json();

      if (response.ok) {
         setMessage(`${title} ${resData?.message}`, 'success');
         cartRefetch();
         cartQtyUpdater(items - 1);
      } else {
         setMessage(`${title} ${resData?.error}`, 'danger');
      }
   }


   const itemQuantityHandler = async (value, productID, variationID, cartID) => {
      try {
         setQtyLoading(true);
         let quantity = parseInt(value);

         if (cartType === 'buy' && state) {
            setQtyLoading(false);
            let qty = (state.quantity = quantity);
            setMessage("Quantity updated to " + qty, "success");
            setState({ ...state, qty });
            return;
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/cart/update-cart-product-quantity`, {
            method: "PUT",
            withCredentials: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json",
               authorization: productID
            },
            body: JSON.stringify({
               actionRequestContext: {
                  pageUri: '/my-cart',
                  type: cartType,
                  pageNumber: 1
               },
               upsertRequest: {
                  cartContext: {
                     productID, variationID, quantity: quantity, cartID
                  }
               }
            })
         });

         const result = await response.json();

         if (result?.success === true && result?.statusCode >= 200) {
            setQtyLoading(false);
            cartRefetch();
            setMessage(result?.message, 'success');
            return;
         } else {

         }
         setQtyLoading(false);

         if (response.status === 401) {
            window.location.reload();
         }

         if (!result?.success) return setMessage(result?.message, 'danger');

      } catch (error) {
         return setMessage(error?.message, 'danger');
      }
   }

   return (
      <div className="card_default d-flex mb-2">
         <div className="d-flex px-3">
            <div className="cart_img d-flex align-items-center justify-content-center">
               {qtyLoading ? "Loading" : <img src={cartProduct?.image && cartProduct?.image} alt="" />}
            </div>
            {
               !checkOut &&
               <div className="ms-2 cart_btn">

                  <button
                     className='badge bg-primary my-1'
                     disabled={cartProduct && cartProduct?.quantity <= 1 ? true : false}
                     onClick={() => itemQuantityHandler(parseInt(cartProduct?.quantity) - 1, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}>
                     -
                  </button>

                  <input
                     className='border px-2' type="number"
                     value={cartProduct?.quantity || 0}
                     onChange={(e) => itemQuantityHandler(e.target.value, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}
                     maxLength='3'
                     style={{ width: '50px' }}
                  />

                  <button
                     className='badge bg-primary my-1'
                     disabled={cartProduct && cartProduct?.quantity >= cartProduct && cartProduct?.variations?.available ? true : false}
                     onClick={() => itemQuantityHandler(parseInt(cartProduct?.quantity) + 1, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}>
                     +
                  </button>
               </div>
            }
         </div>

         <div className="row w-100 card_description">
            <div className="col-12">
               <div className="row">
                  <div className="col-11">

                     <p className="card_title">
                        <Link to={`/product/${cartProduct?.slug}?pId=${cartProduct?.productID}&vId=${cartProduct?.variationID}`}>
                           {cartProduct && cartProduct?.title}
                        </Link>
                     </p>

                     <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="product_price_model">
                           <big><span className="dollar_Symbol">$</span>{cartProduct?.sellingPrice}</big>
                        </div>
                        {
                           (cartProduct && cartProduct?.variant?.sizes) &&
                           <small className="text-muted">Size : {cartProduct?.variant?.sizes}</small>
                        }
                        {
                           (cartProduct && cartProduct?.variant?.color) &&
                           <small className="text-muted">Color : {cartProduct?.variant?.color?.split(',')[0]}</small>
                        }
                        <small className="text-muted">Qty : {cartProduct?.quantity}</small>
                        <small className="text-muted">Stock : {cartProduct?.stock}</small>
                     </div>
                  </div>
                  {
                     !checkOut && <div className="remove_btn col-1 text-end">
                        {
                           cartType !== "buy" && <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cartProduct)}><FontAwesomeIcon icon={faClose} /></button>
                        }

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
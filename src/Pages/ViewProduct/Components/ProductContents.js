import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BtnSpinner from '../../../Components/Shared/BtnSpinner/BtnSpinner';
import { faCartShopping, faHandshake, faLocationPin, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { textToTitleCase } from '../../../Shared/common';


const ProductContents = ({ product, variationID, authRefetch, productRefetch, setMessage, userInfo }) => {
   const [addCartLoading, setAddCartLoading] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();
   const defShipAddrs = userInfo?.buyer?.defaultShippingAddress && userInfo?.buyer?.defaultShippingAddress;

   // add to cart handler
   const addToCartHandler = async (pId, _LID, vId, params) => {
      try {
         if (!userInfo?.email) {
            return navigate('/login', { state: { from: location } });
         }

         if (product?.variations?.stock === "in") {
            setAddCartLoading(true);

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/cart/add-to-cart`, {
               method: "POST",
               withCredentials: true,
               credentials: 'include',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ productID: pId, listingID: _LID, variationID: vId, action: params })
            });

            const result = await response.json();

            if (response.ok && result?.success === true) {
               productRefetch();
               authRefetch();
               setMessage(result?.message, "success");

               setAddCartLoading(false);
               navigate('/my-cart');
            } else {
               setAddCartLoading(false);
            }
         }
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }




   // direct checkout handler
   const buyNowHandler = async (product) => {

      if (!userInfo?.email) {
         return navigate('/login', { state: { from: location } });
      }

      if (product?.variations.stock === "out") {
         return;
      }
      return navigate(`/single-checkout?oTracker=buy.${product?.title}`, {
         state: {
            listingID: product?._LID,
            productID: product?._id,
            variationID: product?.variations?._VID,
            quantity: 1,
            customerEmail: userInfo?.email
         }
      });
   }

   return (
      <div className='row w-100'>
         <div className="col-lg-8">
            <article>

               <h5 className="product_title py-2">
                  <span className='textMute'>{product?.brand}</span> <br />
                  {product?.title}
               </h5>

               <div className="product_rating_model">
                  <small>{product?.ratingAverage || 0} out of 5</small>
               </div>

               <div className="product_price_model">
                  <big>{product?.variations?.pricing?.sellingPrice || product?.variations?.pricing?.price} TK</big>

                  <div>
                     <strike>
                        {product?.variations?.pricing?.price} TK
                     </strike>
                     <span>
                        ({product?.variations?.pricing?.discount || 0}%) off
                     </span>
                  </div>
               </div>


               <small className='text-muted'>
                  <i>
                     {product?.variations?.stock === "out" ? "Out of Stock" : "Hurry, Only " + product?.variations?.available + " Left !"}
                  </i>
               </small>

               <br />

               {
                  product?.swatch && Array.isArray(product?.swatch) &&
                  <div className="p-3 my-4 d-flex align-items-center justify-content-start flex-column">
                     {
                        <div className="d-flex align-items-center justify-content-start w-100">

                           <span>Variants</span>
                           <div className="px-3 d-flex flex-row">

                              {
                                 product?.swatch.map((e, i) => {

                                    let hex = e?.variant?.color.split(",")[1];

                                    return (

                                       <div key={i} className='d-flex align-items-center justify-content-center flex-column'>
                                          {
                                             e?.variant?.size && <Link className={`swatch_size_btn ${e._VID === variationID ? 'active' : ''}`}
                                                to={`/product/${product?.slug}?pId=${product?._id}&vId=${e._VID}`}>
                                                {e?.variant?.size && e?.variant?.size}
                                             </Link>
                                          }

                                          {
                                             e?.variant?.color && <Link className={`swatch_size_btn ${e._VID === variationID ? 'active' : ''}`}
                                                to={`/product/${product?.slug}?pId=${product?._id}&vId=${e._VID}`}>
                                                <div style={{
                                                   backgroundColor: hex,
                                                   display: 'block',
                                                   width: '90%',
                                                   height: '90%',
                                                   borderRadius: "100%"
                                                }}>
                                                </div>
                                             </Link>
                                          }


                                       </div>
                                    )
                                 })
                              }
                           </div>
                        </div>

                     }
                  </div>
               }

               <br />

               {
                  product?.bodyInfo?.keyFeatures && <ul>
                     {
                        Array.isArray(product?.bodyInfo?.keyFeatures) ? product?.bodyInfo?.keyFeatures.map((item, index) => {
                           return (
                              <li style={{ color: "green" }} key={index}>* {item}</li>
                           )
                        }) : ""
                     }
                  </ul>
               }


            </article>

            {
               <div className="py-3 mt-4 product_handler">

                  {
                     (!product?.inCart || typeof product?.inCart === 'undefined') ?
                        <button
                           className='addToCartBtn'
                           disabled={product?.variations?.stock === "out" ? true : false}
                           onClick={() => addToCartHandler(product?._id, product?._LID, product?.variations?._VID, "toCart")}
                        >
                           {
                              addCartLoading ? <BtnSpinner text={"Adding..."} /> : <>
                                 <FontAwesomeIcon icon={faCartShopping} /> Add To Cart
                              </>
                           }
                        </button> :
                        <button className='ms-4 addToCartBtn' onClick={() => navigate('/my-cart')}>
                           Go To Cart
                        </button>
                  }

                  <button
                     className='ms-4 buyBtn'
                     disabled={product?.variations?.stock === "out" ? true : false}
                     onClick={() => buyNowHandler(product)}
                  >
                     Buy Now
                  </button>
               </div>
            }
         </div>

         <div className="col-lg-4">
            <h6>Delivery</h6>

            <div className="pb-2 d-flex align-items-center justify-content-between">
               <div className='pe-2'>
                  <FontAwesomeIcon icon={faLocationPin} />
               </div>
               <div className='textMute'>
                  {
                     defShipAddrs ?
                        <address>
                           <span>
                              {
                                 defShipAddrs?.division + ", " + defShipAddrs?.city + ", " + defShipAddrs?.area
                              }
                           </span>
                        </address>
                        : "Not Found"
                  }
               </div>
            </div>
            <hr />

            {
               product?.fulfilledBy &&
               <div className='pb-3 d-flex align-items-center justify-content-between'>
                  <div className='textMute'>
                     <FontAwesomeIcon icon={faHandshake} /> &nbsp;
                     Fulfilled by
                  </div>
                  <div>
                     {textToTitleCase(product?.fulfilledBy)}
                  </div>
               </div>
            }



            <div className='pb-2 d-flex align-items-center justify-content-between'>
               <div className='textMute'>
                  <FontAwesomeIcon icon={faTruck} /> &nbsp;
                  Standard Delivery
               </div>

               <div>
                  {
                     product?.deliveryCharge
                  } Tk
               </div>
            </div>

            <hr />

            <div className="py-3">
               <small className='textMute'>
                  Sold By : &nbsp;&nbsp;
               </small>
               <span className='seeMore'>
                  {product?.sellerData?.storeName}
               </span>
            </div>
         </div>
      </div>
   );
};

export default ProductContents;
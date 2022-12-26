import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from '../../../Components/Shared/BtnSpinner/BtnSpinner';
import Breadcrumbs from '../../../Shared/Breadcrumbs';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProductContents = ({ product, variationId, authRefetch, productRefetch, setMessage }) => {
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [buyLoading, setBuyLoading] = useState(false);

   const navigate = useNavigate();

   const addToCartHandler = async (pId, _lId, vId, params) => {

      const url = params === "buy" ? `${process.env.REACT_APP_BASE_URL}api/cart/add-buy-product` :
         `${process.env.REACT_APP_BASE_URL}api/cart/add-to-cart`;

      if (product?.variations?.stock === "in") {
         if (params === "buy") {
            setBuyLoading(true);
         } else {
            setAddCartLoading(true);
         }

         const response = await fetch(url, {
            method: "POST",
            withCredentials: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId: pId, listingId: _lId, variationId: vId })
         });

         const resData = await response.json();


         if (response.ok) {
            authRefetch();
            productRefetch();

            setMessage(resData?.message);

            if (params === "buy") {
               setBuyLoading(false);
               navigate(`/product/purchase/${product?._id}`);
            } else {
               setAddCartLoading(false);
               navigate('/my-cart');
            }

         } else {
            setAddCartLoading(false);
            setBuyLoading(false);
         }
      }
   }


   return (
      <>
         <article>

            {/* breadcrumbs  */}
            <Breadcrumbs path={product?.categories}></Breadcrumbs>

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
                                          e?.variant?.size && <Link className={`swatch_size_btn ${e._vId === variationId ? 'active' : ''}`}
                                             to={`/product/${product?.slug}?pId=${product?._id}&vId=${e._vId}`}>
                                             {e?.variant?.size && e?.variant?.size}
                                          </Link>
                                       }

                                       {
                                          e?.variant?.color && <Link className={`swatch_size_btn ${e._vId === variationId ? 'active' : ''}`}
                                             to={`/product/${product?.slug}?pId=${product?._id}&vId=${e._vId}`}>
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

            <div className="py-3">
               <small className='textMute'>
                  Seller : &nbsp;&nbsp;
               </small>
               <span className='seeMore'>
                  {product?.seller?.name}
               </span>
            </div>


            {
               product?.bodyInfo?.keyFeatures && <ul>
                  {
                     Array.isArray(product?.bodyInfo?.keyFeatures) ? product?.bodyInfo?.keyFeatures.map((item, index) => {
                        return (
                           <li style={{ color: "green" }}>* {item}</li>
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
                        disabled={product?.stockInfo?.stock === "out" ? true : false}
                        onClick={() => addToCartHandler(product?._id, product?._lId, product?.variations?.vId, "toCart")}
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
                  disabled={product?.stockInfo?.stock === "out" ? true : false}
                  onClick={() => addToCartHandler(product?._lId, product?.variations?.vId, "buy")}
               >
                  {
                     buyLoading ? <BtnSpinner text={"Buying..."}>
                     </BtnSpinner> : "Buy Now"
                  }
               </button>
            </div>
         }

      </>
   );
};

export default ProductContents;
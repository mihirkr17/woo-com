import { Interweave } from 'interweave';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { faCartShopping, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breadcrumbs from './Breadcrumbs';
import { averageRating } from './common';
import { useState } from 'react';
import { useEffect } from 'react';

const ProductModel = ({ product, addToCartHandler, addCartLoading, buyLoading, showFor, addToWishlist, removeToWishlist }) => {
   const navigate = useNavigate();
   const [tab, setTab] = useState("description");
   const [tabImg, setTabImg] = useState("");
   const [zoom, setZoom] = useState({ transform: "translate3d('0px, 0px, 0px')" });
   useEffect(() => setTabImg(product?.image && product?.image[0]), [product?.image])

   const handleImgTab = (params) => {
      setTabImg(params);
   }

   function handleImageZoom(e) {

      const { left, top, width, height } = e.target.getBoundingClientRect()
      const x = (e.pageX - left) / width * 100
      const y = (e.pageY - top) / height * 100
      setZoom({ transform: `translate3d(${x}px, ${y}px, 0px)` })
   }

   return (
      <div className="row mb-5">
         <div className="col-lg-5 pb-3">
            <div className="view_product_sidebar">
               {
                  product?.inWishlist ? <button title='Remove from wishlist' className='wishlistBtn active' onClick={() => removeToWishlist(product?._id)}>
                     <FontAwesomeIcon icon={faHeart} />
                  </button>
                     : <button className='wishlistBtn' title='Add to wishlist' onClick={() => addToWishlist(product)}>
                        <FontAwesomeIcon icon={faHeart} />
                     </button>
               }
               <div className="product_image" onMouseOver={handleImageZoom}>
                  <img src={tabImg && tabImg} alt="" />
               </div>
               <div className="product_image_tab">
                  {
                     product?.image && product?.image.map((img, index) => {
                        return (
                           <div key={index} className="image_btn" onMouseOver={() => handleImgTab(img)}>
                              <img src={img} alt="" />
                           </div>
                        )
                     })
                  }
               </div>
            </div>
         </div>
         <div className="col-lg-7 pb-3 product_description">
            <article>
               {(showFor !== "admin" && showFor !== "owner" && showFor !== "seller") && <Breadcrumbs path={[product?.genre?.category, product?.genre?.sub_category, product?.genre?.second_category]}></Breadcrumbs>}
               <h5 className="product_title py-3">{product?.title}</h5>
               {/* <small className=' badge bg-success'>Rating : {averageRating(product?.rating) || 0}/5</small><br /> */}

               <div className="product_rating_model">
                  <small>{product?.rating_average || 0} out of 5</small>
               </div>

               <div className="product_price_model">
                  <big>BDT {product?.price_fixed} TK</big>
                  <small><strike><i>BDT {product?.price} TK</i></strike> (-{product?.discount || 0}%) off</small>
               </div>


               <small className='text-muted'><i>{product?.stock === "out" ? "Out of Stock" : "Hurry, Only " + product?.available + " Left !"} </i></small><br />
               <small className='text-muted'>Seller : {product?.seller}</small><br />
               {
                  (showFor === "admin" || showFor === "owner" || showFor === "seller") && <small>{product?.genre?.category + " > " + product?.genre?.sub_category + " > " + product?.genre?.second_category}</small>
               }
            </article>

            {
               (showFor !== "admin" && showFor !== "owner" && showFor !== "seller") && <div className="py-3 mt-4 product_handler">

                  {
                     product?.inCart === false ?
                        <button className='addToCartBtn' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "toCart")}>
                           {addCartLoading ? <BtnSpinner text={"Adding..."}></BtnSpinner> : <><FontAwesomeIcon icon={faCartShopping} /> Add To Cart</>}
                        </button> :
                        <button className='ms-4 addToCartBtn' onClick={() => navigate('/my-cart')}>
                           Go To Cart
                        </button>
                  }

                  <button className='ms-4 buyBtn' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "buy")}>
                     {buyLoading ? <BtnSpinner text={"Buying..."}></BtnSpinner> : <> Buy Now</>}
                  </button>
               </div>
            }

         </div>
         <div className="col-12 py-3 mt-3 card_default">
            <div className="ff_kl3">
               <button className={`ddl_g_btn ${tab === "description" ? "active" : ""}`} onClick={() => setTab("description")}>Product Description</button>
               <button className={`ddl_g_btn ${tab === "spec" ? "active" : ""}`} onClick={() => setTab("spec")}>Specification</button>

            </div>
            <div className="dp_fgk card_description">
               {
                  tab === "description" && <Interweave className='pt-4 product_spec' content={product?.description} />
               }
               {
                  tab === "spec" && <table className='table table-sm'>
                     <thead>
                        <tr>
                           <th>Product Specification : </th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           product?.info?.specification && product?.info?.specification.map((items, index) => {
                              return (
                                 <tr key={index}>
                                    <th>{items?.type} </th>
                                    <td>: {items?.value}</td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>
               }


            </div>
         </div>
      </div>
   );
};

export default ProductModel;
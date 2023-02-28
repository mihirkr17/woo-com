import { Interweave } from 'interweave';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { faCartShopping, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breadcrumbs from './Breadcrumbs';
import { averageRating } from './common';
import { useState } from 'react';
import { useEffect } from 'react';
import ProductImages from '../Pages/ViewProduct/Components/ProductImages';

const ProductModel = ({ product }) => {
   const navigate = useNavigate();
   const [tab, setTab] = useState("description");


   const sizeBtnStyle = {
      border: '1px solid blue',
      width: '40px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'blue',
      backgroundColor: 'white',
      margin: '0 0.3rem'
   }

   const sizeBtnStyleDisable = {
      border: '1px solid gray',
      width: '40px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'gray',
      backgroundColor: 'white',
      margin: '0 0.3rem'
   }

   return (
      <div className="row mb-5">
         <div className="col-lg-5 pb-3">
            <ProductImages />
         </div>


         <div className="col-lg-7 pb-3 product_description">
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
                  <span><strike>{product?.variations?.pricing?.price} TK</strike> (-{product?.variations?.pricing?.discount || 0}%) off</span>
               </div>


               <small className='text-muted'>
                  <i>
                     {product?.variations?.stock === "out" ? "Out of Stock" : "Hurry, Only " + product?.variations?.inventoryDetails?.available + " Left !"}
                  </i>
               </small>

               <br />

               <small className='textMute'>Seller : {product?.sellerData?.storeName}</small><br />
            </article>

         </div>
         
         <div className="col-12 py-3 mt-3 card_default">
            <div className="ff_kl3">
               <button className={`ddl_g_btn ${tab === "description" ? "active" : ""}`} onClick={() => setTab("description")}>Product Description</button>
               <button className={`ddl_g_btn ${tab === "spec" ? "active" : ""}`} onClick={() => setTab("spec")}>Specification</button>

            </div>
            <div className="dp_fgk card_description">
               {
                  tab === "description" && <Interweave className='pt-4 product_spec' content={product?.bodyInfo?.description} />
               }
               {
                  tab === "spec" && <table className='table table-sm'>
                     <thead>
                        <tr>
                           <th>Product Specification : </th>
                        </tr>
                     </thead>
                     <tbody>
                     </tbody>
                  </table>
               }


            </div>
         </div>
      </div>
   );
};

export default ProductModel;
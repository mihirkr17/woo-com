import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   return (
      <div className='product_card my-2'>
         <Link to={`/product/${product?.slug}`}>
            <div className="product_card_img">
               <img src={product?.image[0]} alt='' />
            </div>
            <article className='product_card_description'>
               <div className="product_title">
                  <h6>
                     {product?.title && product?.title.length > 20 ? product?.title.slice(0, 20) + "..." : product?.title}
                  </h6>
               </div>

               <div className='product_meta'>
                  <div className="product_brand">
                     <small>Brand : {product?.brand}</small><br />
                  </div>

                  <div className="product_rating_model">
                     <small>{product?.rating_average || 0} out of 5</small>
                  </div>

                  <div className="product_price_model">
                     <big>BDT {product?.price_fixed} TK</big>
                     <small><strike><i>BDT {product?.price} TK</i></strike> (-{product?.discount || 0}%) off</small>
                  </div>

               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
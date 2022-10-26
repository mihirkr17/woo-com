import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   return (
      <div className='product_card my-2'>
         <Link to={`/product/${product?.variations?.slug}?pId=${product?._id}&vId=${product?.variations?.vId}`}>
            <div className="product_card_img">
               <img src={product?.variations?.images && product?.variations?.images[0]} alt='' />
            </div>
            <article className='product_card_description'>
               <div className="product_title">
                  <h6>
                     {product?.variations?.title && product?.variations?.title.length > 20 ? product?.variations?.title.slice(0, 20) + "..." : product?.variations?.title}
                  </h6>
               </div>

               <div className='product_meta'>
                  <div className="product_brand">
                     <small>Brand : {product?.brand}</small><br />
                  </div>

                  <div className="product_rating_model">
                     <small>{product?.ratingAverage || 0} out of 5</small>
                  </div>

                  <div className="product_price_model">
                     <big>{product?.variations?.pricing?.sellingPrice || product?.variations?.pricing?.price} TK</big>
                     <span><strike>{product?.variations?.pricing?.price} TK</strike> (-{product?.variations?.pricing?.discount || 0}%) off</span>
                  </div>

               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
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
                  <span>{product?.brand}</span>
                  <h1>
                     {product?.variations?.title && product?.variations?.title.length > 20 ? product?.variations?.title.slice(0, 20) + "..." : product?.variations?.title}
                  </h1>
                  <small>{product?.packageInfo?.inTheBox}</small>
               </div>

               <div className='product_meta'>

                  <div className="rating_model">
                     <small>{product?.ratingAverage || 0} ({product?.reviews && product?.reviews.length})</small>
                  </div>

                  <div className="price_model">
                     <big>{product?.variations?.pricing?.sellingPrice || product?.variations?.pricing?.price} TK</big>
                     <p>
                        <strike>
                           {product?.variations?.pricing?.price} TK
                        </strike>
                        ({product?.variations?.pricing?.discount || 0}%) off
                     </p>
                  </div>

               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
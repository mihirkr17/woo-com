import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   return (
      <div className='product_card my-2'>
         <Link to={`/product/${product?.slug}?pId=${product?._id}&vId=${product?._VID}`}>
            <div className="product_card_img">
               <img src={product?.image && product?.image} alt='' />
            </div>
            <article className='product_card_description'>
               <div className="product_title">
                  <span>{product?.brand}</span>
                  <h1>
                     {product?.title && product?.title.length > 20 ? product?.title.slice(0, 20) + "..." : product?.title}
                  </h1>
                  <small>{product?.packageInfo?.inTheBox}</small>
               </div>

               <div className='product_meta'>

                  <div className="rating_model">
                     <small>{product?.ratingAverage || 0} ({product?.reviews && product?.reviews.length})</small>
                  </div>

                  <div className="price_model">
                     <big><span className='dollar_Symbol'>$</span>{product?.pricing?.sellingPrice || product?.pricing?.price}</big>
                     <p>
                        <strike>
                           $ {product?.pricing?.price}
                        </strike>
                        ({product?.pricing?.discount || 0}%) off
                     </p>
                  </div>

               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   return (
      <div className='card_default my-2'>
         {/* <Link to={`/categories?sub_category=${product?.sub_category}`}> */}
         <Link to={`/${product?.category}/${product?.sub_category}/${product?.slug}`}>
            <div className="card_img">
               <img src={product?.image} alt='' />
            </div>
            <article className='card_description'>
               <h6 className='card_title'>{product?.title && product?.title.length > 20 ? product?.title.slice(0, 20) + "..." : product?.title}</h6>
               <div className='card_list'>
                  <small className='text-muted'>Brand : {product?.brand}</small>
                  <big>${product?.price_fixed}</big>
                  <small><strike>${product?.price}</strike> -{product?.discount || 0}%</small>
               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
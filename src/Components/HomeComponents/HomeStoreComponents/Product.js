import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   return (
      <div className='card_default'>
         <Link to={`/product/${product?._id}`}>
            <div className="card_img">
               <img src={product?.image} alt='' />
            </div>
            <article className='card_description'>
               <h4 className='card_title'>{product?.title}</h4>
               <div className='card_list'>
                  <small>Price : {product?.price}</small>
                  <small>Category : {product?.category}</small>
               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
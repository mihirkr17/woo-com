import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
   let productDiscount = product?.discount || 0;
   let dis = (productDiscount / 100) * product?.price;
   let finalPrice = product?.price - dis;
   return (
      <div className='card_default'>
         <Link to={`/product/${product?._id}`}>
            <div className="card_img">
               <img src={product?.image} alt='' />
            </div>
            <article className='card_description'>
               <h6 className='card_title'>{product?.title.length > 40 ? product?.title.slice(0, 40) + "..." : product?.title}</h6>
               <div className='card_list'>
                  <big>{finalPrice.toFixed(2)}$</big>
                  <small><strike>{product?.price}$</strike> -{product?.discount || 0}%</small>
               </div>
            </article>
         </Link>
      </div>
   );
};

export default Product;
import React from 'react';
import Product from '../../../Shared/Product';

const RelatedProducts = ({ relatedProducts }) => {


   return (
      <>
         <h5 className="text-center py-1">Related Product</h5>
         <div className="row product_wrapper">
            {
               relatedProducts && relatedProducts.map((p, i) => {
                  return (
                     <Product key={i} product={p}></Product>
                  )
               }).reverse().slice(0, 4)
            }

         </div>
      </>
   );
};

export default RelatedProducts;
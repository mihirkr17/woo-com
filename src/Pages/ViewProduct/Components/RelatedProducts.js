import React from 'react';
import Product from '../../../Shared/Product';

const RelatedProducts = ({ relatedProducts }) => {


   return (
      <>
         <h5 className="text-center py-1">Related Product</h5>
         <div className="row">
            {
               relatedProducts && relatedProducts.map(p => {
                  return (
                     <div key={p?.variations?.vId} className="col-10 mx-auto mb-2">
                        <Product product={p}></Product>
                     </div>
                  )
               }).reverse().slice(0, 4)
            }

         </div>
      </>
   );
};

export default RelatedProducts;
import React from 'react';
import { useFetch } from '../../../Hooks/useFetch';
import Product from '../../../Shared/Product';

const RecommendedProducts = () => {
   const { data } = useFetch(`${process.env.REACT_APP_BASE_URL}api/products/recommended`);

   return (
      <div className='section_default recommended_comp'>
         <div className="container">
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Recommended For You</h5>
            </div>
            <div className="row">
               {
                  data && data.map((product, index) => {
                     return (
                        <div className="col-lg-2 col-md-4" key={index}>
                           <Product product={product}></Product>
                        </div>
                     )
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default RecommendedProducts;
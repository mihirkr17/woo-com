import React from 'react';
import Product from '../../../Shared/Product';

const TopRated = ({ data }) => {

   return (
      <div className='section_default recommended_comp'>
         <div className="container">
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Top Rated</h5>
            </div>
            <div className="row product_wrapper">
               {
                  data && data.map((product, index) => {
                     return (
                        <Product key={index} product={product}></Product>
                     )
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default TopRated;
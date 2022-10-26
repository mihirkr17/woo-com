import React from 'react';
import Product from '../../../Shared/Product';

const TopSell = ({ data }) => {

   return (
      <div className='section_default'>
         <div className="container">
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Top Selling</h5>
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

export default TopSell;
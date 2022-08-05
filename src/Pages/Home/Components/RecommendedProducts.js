import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../Hooks/useFetch';

import Product from '../../../Shared/Product';

const RecommendedProducts = () => {
   
   const { data, loading } = useFetch(`${process.env.REACT_APP_BASE_URL}api/products/recommended`);

   return (
      <div className='section_default'>
         <div className="container">
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Recommended For You</h5>
               <Link to={`/product/recent/all`} className='btn btn-sm'>See More</Link>
            </div>
            <div className="row">
               {
                  data && data.sort((a, b) => {
                     return b["top_sell"] - a["top_sell"]
                  }).map((product, index) => {
                     return (
                        <div className="col-lg-2" key={index}>
                           <Product product={product}></Product>
                        </div>
                     )
                  }).slice(0, 6)
               }
            </div>
         </div>
      </div>
   );
};

export default RecommendedProducts;
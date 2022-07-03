import React from 'react';
import { Link } from 'react-router-dom';
import Product from '../../../Shared/Product';

const RecentProducts = ({ data }) => {
   return (
      <div className="section_default my-3">
         <div className='container'>
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Recent Products</h5>
               <Link to={`/product/recent/all`} className='btn btn-sm'>See More</Link>
            </div>
            <div className="row">
               {
                  data && data.map((product, index) => {
                     return (
                        <div className="col-lg-3" key={index}>
                           <Product product={product}></Product>
                        </div>
                     )
                  }).reverse().slice(0, 4)
               }
            </div>
         </div>
      </div>
   );
};

export default RecentProducts;
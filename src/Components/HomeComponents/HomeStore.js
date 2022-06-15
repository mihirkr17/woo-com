import React from 'react';
import { Link } from 'react-router-dom';
import Product from './HomeStoreComponents/Product';

const HomeStore = ({ data }) => {

   return (
      <section className='section_default'>
         <div className="d-flex justify-content-between py-2">
            <h5 className="py-2">All Products</h5>
            <Link to={`/product/recent/all`} className='btn btn-sm'>See More</Link>
         </div>
         <div className='row'>
            {
               data && data.map(product => {
                  return (
                     <div className="col-sm-5 col-md-3 col-lg-2" key={product._id}>
                        <Product product={product} key={product._id}></Product>
                     </div>
                  )
               }).slice(0, 12)
            }
         </div>
      </section>
   );
};

export default HomeStore;
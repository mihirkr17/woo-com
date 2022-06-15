import React from 'react';
import { useFetch } from '../Hooks/useFetch';
import Product from './HomeComponents/HomeStoreComponents/Product';

const RecommendedProducts = ({ query }) => {
   const { data: productArr, loading } = useFetch('https://woo-com-serve.herokuapp.com/products');

   return (
      <div className='section_default' style={{ position: "fixed", top: "70px", left: "0", overflowY: "auto", background: "aquamarine", zIndex: "9999" }}>
       <div className="container">
       <div className="row">
            {
               productArr && productArr.filter((f) => {
                  if (query === '') {
                     return false;
                  } else if (f?.title.toLowerCase().includes(query.toLowerCase())) {
                     return f;
                  } else {
                     return false;
                  }
               }).map(productDetails => {
                  return (
                     <div className="col-sm-5 col-md-3 col-lg-2" key={productDetails._id}>
                        <Product product={productDetails} key={productDetails._id}></Product>
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
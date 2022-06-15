import React from 'react';
import Product from '../../Components/HomeComponents/HomeStoreComponents/Product';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';

const AllRecentProduct = () => {
   const { data, loading } = useFetch('https://woo-com-serve.herokuapp.com/products/');
   if (loading) {return <Spinner></Spinner>};
   return (
      <div className="section_default bg-secondary">
         <div className='container'>
            <h5 className="py-2">All Recent Products</h5>

            <div className="row">
               {
                  data && data.map((product, index) => {
                     return (
                        <div className="col-lg-3 mb-4" key={index}>
                           <Product product={product}></Product>
                        </div>
                     )
                  }).reverse()
               }
            </div>
         </div>
      </div>
   );
};

export default AllRecentProduct;
import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import Product from '../../Shared/Product';
import Spinner from '../Shared/Spinner/Spinner';
import "./SearchProduct.css";

const SearchProduct = ({ query, setQuery }) => {
   const BASE_URL = useBASE_URL();
   const { data: allProducts, loading } = useFetch(`${BASE_URL}products`);

   if (loading) return <Spinner></Spinner>;

   return (
      <>
         {
            query !== "" ? <div className='search_wrapper'>
               <button className='btn btn-sm btn-danger' onClick={() => setQuery("")}>x</button>
               <div className="search_overlay">
                  <div className="container">
                     <div className="row">
                        {
                           allProducts && allProducts.filter((f) => (query !== "" ? f?.title.toLowerCase().includes(query.toLowerCase()) : "")).map(productDetails => {
                              return (
                                 <div className="col-lg-2" key={productDetails._id} onClick={() => setQuery("")}>
                                    <Product product={productDetails} key={productDetails._id}></Product>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
            </div> : ""
         }
      </>
   );
};

export default SearchProduct;
import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Product from '../HomeComponents/HomeStoreComponents/Product';
import Spinner from './Spinner/Spinner';
import "./SearchProduct.css";

const SearchProduct = ({ query }) => {
   const { data: productArr, loading } = useFetch('https://woo-com-serve.herokuapp.com/products');

   if (loading) return <Spinner></Spinner>;

   return (
      <>
         {
            query !== "" ? <div className='search_wrapper'>
               <div className="search_overlay">
                  <div className="container">
                     <div className="row">
                        {
                           productArr && productArr.filter((f) => (query !== "" ? f?.title.toLowerCase().includes(query.toLowerCase()) : "")).map(productDetails => {
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

            </div> : ""
         }
      </>
   );
};

export default SearchProduct;
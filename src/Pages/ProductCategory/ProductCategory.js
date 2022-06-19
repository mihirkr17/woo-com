import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { unstable_HistoryRouter, useLocation, useParams } from 'react-router-dom';
import Product from '../../Components/HomeComponents/HomeStoreComponents/Product';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';

const ProductCategory = () => {
   const { category } = useParams();
   const { data: productByCategory, loading } = useFetch(`https://woo-com-serve.herokuapp.com/product-category/${category}`);
   const [filters, setFilters] = useState('best_match');
   const [products, setProducts] = useState([]);
   const location = useLocation();
   const loc = location.pathname.split("/");

   if (loading) <Spinner></Spinner>;


   // filter product by price
   useEffect(() => {
      let g;

      if (filters === "best_match") {
         setProducts(productByCategory);
      } else if (filters === "lowest") {
         g = productByCategory && productByCategory.map(m => m).sort((a, b) => {
            return a['price'] - b['price'];
         });
         setProducts(g);
      } else {
         g = productByCategory && productByCategory.map(m => m).sort((a, b) => {
            return b['price'] - a['price'];
         });

         setProducts(g);
      }

   }, [productByCategory, filters]);


   return (
      <div className="section_default">
         <div className='container'>
            <h5>{category}</h5>
            <div className="category_header py-4">
               <div className="sort_price">
                  <span>Sort By </span>
                  <select name="filter" id="" onChange={(e) => setFilters(e.target.value)}>
                     <option value="best_match">Best Match</option>
                     <option value="lowest">Lowest</option>
                     <option value="highest">Highest</option>
                  </select>
               </div>
            </div>
            <div className="row">
               {
                  products && products.map(p => {
                     return (
                        <div key={p?._id} className="col-lg-3 mb-4">
                           <Product product={p}></Product>
                        </div>
                     )
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default ProductCategory;
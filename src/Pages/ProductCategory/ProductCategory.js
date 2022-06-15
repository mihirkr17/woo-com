import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../../Components/HomeComponents/HomeStoreComponents/Product';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';

const ProductCategory = () => {
   const { category } = useParams();
   const { data: productByCategory, loading } = useFetch(`https://woo-com-serve.herokuapp.com/product-category/${category}`);

   if (loading) return <Spinner></Spinner>;

   return (
      <div className="section_default">
         <div className='container'>
            <div className="row">
               {
                  productByCategory && productByCategory.map(p => {
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
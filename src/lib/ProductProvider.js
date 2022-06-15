import React, { createContext } from 'react';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useFetch } from '../Hooks/useFetch';


export const ProductContext = createContext();

 const ProductProvider = ({ children }) => {
   const { data, loading } = useFetch('https://woo-com-serve.herokuapp.com/products/');
   if (loading) return <Spinner></Spinner>

   return (
      <ProductContext.Provider value={data}>
         {children}
      </ProductContext.Provider>
   );
};
export default ProductProvider;
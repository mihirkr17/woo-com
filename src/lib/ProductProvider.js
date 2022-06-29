import React, { createContext } from 'react';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useFetch } from '../Hooks/useFetch';
import { useBASE_URL } from './BaseUrlProvider';


export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
   const BASE_URL = useBASE_URL();
   const { data, loading } = useFetch(`${BASE_URL}products/`);
   if (loading) return <Spinner></Spinner>

   return (
      <ProductContext.Provider value={data}>
         {children}
      </ProductContext.Provider>
   );
};
export default ProductProvider;
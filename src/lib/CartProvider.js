import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useBASE_URL } from './BaseUrlProvider';
import { useAuthUser } from './UserProvider';
export const CartContext = createContext();

const CartProvider = ({ children }) => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser()
   const { data, loading, refetch } = useFetch(`${BASE_URL}my-cart-items/${user?.email}`);
   const productLength = data && data?.product ? data?.product.length : 0;

   return (
      <CartContext.Provider value={{ data, loading, refetch, productLength }}>
         {children}
      </CartContext.Provider>
   )
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
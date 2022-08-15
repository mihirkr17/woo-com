import React from 'react';
import { createContext } from 'react';
import { useAuthUser } from '../App';
import { useFetch } from '../Hooks/useFetch';
export const CartContext = createContext();

const CartProvider = ({ children }) => {
   const user = useAuthUser();

   // fetching cart information and data from mongodb
   const { data: cart, cartLoading, refetch } = useFetch(user && `${process.env.REACT_APP_BASE_URL}api/my-cart-items`, {
      headers: {
         authorization: `Basic ${user?.email}`
      }
   });
   return (
      <CartContext.Provider value={{ cart, cartLoading, refetch, cartProductCount: cart?.product && (cart?.product.length || 0) }}>
         {children}
      </CartContext.Provider>
   );
};

export default CartProvider;
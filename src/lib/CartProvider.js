import React, { useContext, useEffect, useReducer, createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useBASE_URL } from './BaseUrlProvider';
import { useAuthUser } from './UserProvider';
export const CartContext = createContext();

export const reducer = (state, action) => {
   if (action.type === "INIT_CART") {
      return action.payload;
   }
}

const cart = {}
const cartLength = {}

const CartProvider = ({ children }) => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { data, loading, refetch } = useFetch(user && `${BASE_URL}my-cart-items/${user?.email}`);

   const [state, dispatch] = useReducer(reducer, { cart, cartLength });

   useEffect(() => {
      (async () => {
         const response = await fetch(user && `${BASE_URL}my-cart-items/${user?.email}`);
         if (response.ok) {
            const resData = await response.json();
            dispatch({ type: "INIT_CART", payload: { cart: resData, cartLength: resData?.product.length } });
         }
      })();
   }, [BASE_URL, user, data]);

   const productLength = data && data?.product ? data?.product.length : 0;

   return (
      <CartContext.Provider value={{ data, loading, refetch, productLength, state, dispatch }}>
         {children}
      </CartContext.Provider>
   )
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
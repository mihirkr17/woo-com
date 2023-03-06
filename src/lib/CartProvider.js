import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {

   const [cartLoading, setCartLoading] = useState(false);
   const [cartData, setCartData] = useState({});
   const [cartError, setCartError] = useState("");
   const [cartRef, setCartRef] = useState(false);

   const cartRefetch = () => setCartRef(e => !e);

   useEffect(() => {
      const startFetch = setTimeout(() => {
         (async () => {
            try {
               setCartLoading(true);

               const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/cart/cart-context`, {
                  method: "GET",
                  withCredentials: true,
                  credentials: "include"
               });

               const result = await response.json();

               if (!response.ok) {
                  setCartLoading(false);
               }

               if (result?.statusCode === 200 && result?.success === true) {
                  setCartLoading(false);
                  setCartData(result?.data?.module);
               }
            } catch (error) {
               setCartError(error?.message);
            } finally {
               setCartLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(startFetch);
   }, [cartRef]);

   return (
      <CartContext.Provider value={{ cartData, cartLoading, cartError, cartRefetch }}>
         {children}
      </CartContext.Provider>
   );
};

export const useCartContext = () => useContext(CartContext);

export default CartProvider;
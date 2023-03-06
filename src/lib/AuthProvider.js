import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { authLogout } from '../Shared/common';
export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
   const loggedUUID = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('loggedUUID');
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(true);
   const [authErr, setAuthErr] = useState();
   const [ref, setRef] = useState(false);


   const authRefetch = () => setRef(e => !e);

   useEffect(() => {

      if (!loggedUUID) {
         setAuthLoading(false);
         return;
      }

      const runFunc = setTimeout(() => {
         (async () => {
            try {
               setAuthLoading(true);

               const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/fau`, {
                  withCredentials: true,
                  credentials: 'include',
                  method: "GET",
                  headers: {
                     authorization: loggedUUID
                  }
               });

               const data = await response.json();

               if (response.ok) {
                  setAuthLoading(false);
                  const userData = data && data?.data;
                  setRole(userData?.role);
                  setUserInfo(userData);
               } else {
                  setAuthLoading(false);

                  if (response.status === 401) {
                     await authLogout();
                     return;
                  }
               }

            } catch (error) {
               setAuthErr(error?.message);
            } finally {
               setAuthLoading(false);
            }
         })()
      }, 0);

      return () => clearTimeout(runFunc);

   }, [ref, loggedUUID]);

   function cartQtyUpdater(params) {

      if (userInfo?.buyer?.shoppingCartItems) {
         let buyer = userInfo?.buyer;

         let newQty = (buyer["shoppingCartItems"] = params);

         setUserInfo({ ...userInfo, newQty })
      }
   }

   return (
      <AuthContext.Provider value={{ role, userInfo, authRefetch, authLoading, authErr, cartQtyUpdater }}>
         {children}
      </AuthContext.Provider>
   )

};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
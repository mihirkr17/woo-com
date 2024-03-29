import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { authLogout } from '../Shared/common';
import { useBaseContext } from './BaseProvider';
export const AuthContext = createContext();


const AuthProvider = ({ children }) => {

   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(true);
   const [authErr, setAuthErr] = useState();
   const [ref, setRef] = useState(false);
   const { setMessage } = useBaseContext();


   const authRefetch = () => setRef(e => !e);

   useEffect(() => {
      // const loggedUUID = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('loggedUUID');
      const loggedUUID = localStorage.getItem("uuid");

      const runFunc = setTimeout(() => {
         (async () => {
            try {

               if (loggedUUID) {
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
               } else {
                  setAuthLoading(false);
               }

            } catch (error) {
               setAuthErr(error?.message);
            } finally {
               setAuthLoading(false);
            }
         })()
      }, 0);

      return () => clearTimeout(runFunc);

   }, [ref]);

   function cartQtyUpdater(params) {

      if (userInfo?.buyer?.shoppingCartItems) {
         let buyer = userInfo?.buyer;

         let newQty = (buyer["shoppingCartItems"] = params);

         setUserInfo({ ...userInfo, newQty })
      }
   }

   return (
      <AuthContext.Provider value={{ role, userInfo, authRefetch, authLoading, authErr, cartQtyUpdater, setMessage }}>
         {children}
      </AuthContext.Provider>
   )

};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
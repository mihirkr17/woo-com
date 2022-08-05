import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.init';

import { useAuthUser } from './UserProvider';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   
   const user = useAuthUser();
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState(null || {} || []);
   const [authLoading, setAuthLoading] = useState(false);
   const [err, setErr] = useState();
   const navigate = useNavigate();
   const [ref, setRef] = useState(false);
   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   let authRefetch;
   authRefetch = () => setRef(e => !e);

   useEffect(() => {
      const controller = new AbortController();
      token && (async () => {
         try {
            setAuthLoading(true);

            if (user && token) {
               const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/fetch-auth-user`, {
                  method: "GET",
                  headers: {
                     "Content-Type": "application/json",
                     authorization: `Bearer ${token}`
                  },
                  signal: controller.signal
               });

               const data = await response.json();

               console.log(data?.message, token);

               if (response.status === 401) {
                  document.cookie = 'accessToken=""; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                  signOut(auth);
                  // window.location.reload();
               }

               if (response.ok) {
                  const userData = data?.result;

                  if (userData) {
                     setRole(userData?.role);
                     setUserInfo(userData);
                  }
                  setAuthLoading(false);
               }
            }

            if (!user) {
               setRole("");
               setAuthLoading(false);
               setUserInfo(null);
            }

         } catch (error) {
            setErr(error);
         }
      })();


      return () => controller?.abort();

   }, [token, user, navigate,  ref]);

   return (
      <AuthContext.Provider value={{ role, authLoading, err, userInfo, authRefetch }}>
         {children}
      </AuthContext.Provider>
   );
};

export default AuthProvider;
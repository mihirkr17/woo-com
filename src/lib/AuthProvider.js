import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.init';
import { useBASE_URL } from './BaseUrlProvider';
import { useAuthUser } from './UserProvider';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState(null || {} || []);
   const [authLoading, setAuthLoading] = useState(false);
   const [err, setErr] = useState();
   const navigate = useNavigate();
   const [ref, setRef] = useState(false);

   let authRefetch;
   authRefetch = () => setRef(e => !e);

   useEffect(() => {
      const controller = new AbortController();
      (async () => {
         try {
            const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
            const token = cookieObj.get('accessToken');
            setAuthLoading(true);

            if (user && token) {
               const response = await fetch(`${BASE_URL}api/fetch-auth-user`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  },
                  signal: controller.signal
               });

               const data = await response.json();

               if (response.status === 401) {
                  document.cookie = 'accessToken=""; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                  signOut(auth);
                  window.location.reload();
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

   }, [user, navigate, BASE_URL, ref]);

   return (
      <AuthContext.Provider value={{ role, authLoading, err, userInfo, authRefetch }}>
         {children}
      </AuthContext.Provider>
   );
};

export default AuthProvider;
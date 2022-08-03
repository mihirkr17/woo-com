import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase.init';
import { useBASE_URL } from '../lib/BaseUrlProvider';
import { useAuthUser } from '../lib/UserProvider';

const useAuth = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState(null || {} || []);
   const [authLoading, setAuthLoading] = useState(false);
   const [err, setErr] = useState();
   const [ref, setRef] = useState(false);
   const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');

   let authRefetch;
   authRefetch = () => setRef(e => !e);

   useEffect(() => {
      if (!token) {
         signOut(auth);
      }
   }, [token]);


   useEffect(() => {

      const controller = new AbortController();
       (async () => {
         try {
            setAuthLoading(true);

            if (token) {
               const response = await fetch(`${BASE_URL}api/fetch-auth-user`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  },
                  signal: controller.signal
               });

               const data = await response.json();

               if (response.status >= 200 && response.status <= 299) {
                  const userData = data && data?.result;

                  if (userData) {
                     setRole(userData?.role);
                     setUserInfo(userData);
                  }
                  setAuthLoading(false);
               } else {
                  setAuthLoading(false);
                  document.cookie = 'accessToken=;';
                  signOut(auth);
               }
            }
          
            if (!user) {
               setRole("");
               setAuthLoading(false);
               setUserInfo({});
            }

         } catch (error) {
            setErr(error);
         } finally {
            setAuthLoading(false);
         }
      })();

      return () => controller?.abort();

   }, [BASE_URL, user, token, ref]);

   return { role, authLoading, err, userInfo, authRefetch };
};

export default useAuth;
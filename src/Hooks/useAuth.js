import { useEffect, useState } from 'react';
import { useBASE_URL } from '../lib/BaseUrlProvider';
import { loggedOut } from '../Shared/common';

const useAuth = (user) => {
   const BASE_URL = useBASE_URL();
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState(null || {} || []);
   const [authLoading, setAuthLoading] = useState(false);
   const [err, setErr] = useState();
   const [ref, setRef] = useState(false);

   let authRefetch;
   authRefetch = () => setRef(e => !e);

   useEffect(() => {

      // const controller = new AbortController();
      const runFunc = setTimeout(() => {
         (async () => {
            try {
               if (user) {
                  setAuthLoading(true);

                  const response = await fetch(`${BASE_URL}api/fetch-auth-user`, {
                     method: "GET",
                     withCredentials: true,
                     credentials: "include",
                     // signal: controller.signal
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
                     await loggedOut();
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
         })()
      }, 1000);

      return () => clearTimeout(runFunc);

   }, [BASE_URL, user, ref]);

   return { role, authLoading, err, userInfo, authRefetch };
};

export default useAuth;
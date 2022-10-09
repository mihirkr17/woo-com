import { useEffect, useState } from 'react';
import { authLogout } from '../Shared/common';

const useAuth = () => {
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(false);
   const [err, setErr] = useState();
   const [ref, setRef] = useState(false);

   let authRefetch;
   authRefetch = () => setRef(e => !e);

   useEffect(() => {
      setAuthLoading(true);
      const runFunc = setTimeout(() => {
         (async () => {
            try {
               const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/fetch-auth-user`, {
                  withCredential: true,
                  credentials: 'include',
               });

               const data = await response.json();

               setAuthLoading(false);

               if (response.status === 401 || response.status === 403) {
                  await authLogout();
               }

               if (response.status >= 200 && response.status <= 299) {
                  const userData = data && data?.data;

                  if (userData) {
                     setRole(userData?.role);
                     setUserInfo(userData);
                  }
                  setAuthLoading(false);
               }

            } catch (error) {
               setErr(error?.message);
            } finally {
               setAuthLoading(false);
            }
         })()
      }, 0);

      return () => clearTimeout(runFunc);

   }, [ref]);

   return { role, authLoading, err, userInfo, authRefetch };
};

export default useAuth;
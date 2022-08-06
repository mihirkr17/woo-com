import { useEffect, useState } from 'react';
import { loggedOut } from '../Shared/common';

const useAuth = (user) => {
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
                  const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/fetch-auth-user/${user?.email}`);
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
               } else {
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
      }, 200);

      return () => clearTimeout(runFunc);

   }, [user, ref]);

   return { role, authLoading, err, userInfo, authRefetch };
};

export default useAuth;
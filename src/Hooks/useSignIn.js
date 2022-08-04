import { useEffect, useState } from 'react';
import { useBASE_URL } from '../lib/BaseUrlProvider';

export const useSignIn = (user) => {
   const BASE_URL = useBASE_URL();
   const [isLogged, setIsLogged] = useState(false);

   useEffect(() => {
      const controller = new AbortController();

      (async () => {
         try {
            if (user) {
               const email = user?.user?.email;
               const url = `${BASE_URL}api/sign-user/${email}`;
               const response = await fetch(url, {
                  method: "PUT",
                  withCredentials: true,
                  credentials: "include",
                  signal: controller.signal
               });

               const resData = await response.json();

               if (response.status === 400) {
                  return window.location.reload();
               }

               if (response.ok) {
                  if (resData) {
                     setIsLogged(true);
                  }
               }
            }
         } catch (error) {
            throw new Error(`Something went wrong ${error}`);
         }
      })();

      return () => controller?.abort();
   }, [user, BASE_URL]);

   return [isLogged];
};
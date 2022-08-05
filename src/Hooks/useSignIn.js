import { useEffect, useState } from 'react';


export const useSignIn = (user) => {
   
   const [isLogged, setIsLogged] = useState(false);

   useEffect(() => {
      const controller = new AbortController();

      (async () => {
         try {
            if (user) {
               const email = user?.user?.email;
               const url = `${process.env.REACT_APP_BASE_URL}api/sign-user/${email}`;
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
   }, [user, ]);

   return [isLogged];
};
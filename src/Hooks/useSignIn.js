import { useEffect, useState } from 'react';

export const useSignIn = (user) => {
   const [isLogged, setIsLogged] = useState("");

   useEffect(() => {
      const handler = setTimeout(() => {
         (async () => {
            try {
               if (user) {
                  const email = user?.user?.email;
                  const url = `${process.env.REACT_APP_BASE_URL}api/sign-user/${email}`;
                  const response = await fetch(url, {
                     method: "PUT",
                     withCredentials: true,
                     credentials: "include"
                  });

                  const resData = await response.json();

                  if (response.status === 400) {
                     return window.location.reload();
                  }

                  if (response.ok) {
                     if (resData) {
                        setIsLogged(resData?.message);
                     }
                  }
               }
            } catch (error) {
               throw new Error(`Something went wrong ${error}`);
            }
         })();
      }, 100);

      return () => clearTimeout(handler);
   }, [user]);

   return [isLogged];
};
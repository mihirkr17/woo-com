import { useEffect, useState } from 'react';

export const useSignIn = (user) => {
   const [isLogged, setIsLogged] = useState("");

   useEffect(() => {
      const handler = setTimeout(() => {
         (async () => {
            try {
               if (user) {
                  const email = user?.user?.email;
                  const name = user?.user?.displayName;
                  const url = `${process.env.REACT_APP_BASE_URL}api/sign-user`;
                  const response = await fetch(url, {
                     method: "PUT",
                     withCredentials: true,
                     credentials: "include",
                     headers: {
                        "Content-Type": "application/json",
                        authorization: `Basic ${email}`
                     },
                     body: JSON.stringify({ name })
                  });

                  const resData = await response.json();

                  if (response.status === 400) {
                     console.log(resData?.message);
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
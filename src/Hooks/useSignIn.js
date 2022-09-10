import { useEffect, useState } from 'react';

export const useSignIn = (user) => {
   const [isLogged, setIsLogged] = useState("");

   useEffect(() => {
      const handler = setTimeout(() => {
         (async () => {
            try {
               if (user) {
                  const email = user?.user?.email;
                  const name = user?.user?.displayName || email.slice(0, email.indexOf("@") - 1);
                  const photoURL = user?.user?.photoURL;
                  const url = `${process.env.REACT_APP_BASE_URL}api/user/sign-user`;
                  const response = await fetch(url, {
                     method: "POST",
                     withCredentials: true,
                     credentials: "include",
                     headers: {
                        "Content-Type": "application/json",
                        authorization: `${email}`
                     },
                     body: JSON.stringify({ name, photoURL })
                  });

                  const resData = await response.json();

                  if (response.status === 400) {
                     console.log(resData?.error);
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
import { useEffect, useState } from "react";

export const useToken = (user) => {
   const [token, setToken] = useState(null);

   useEffect(() => {
      const email = user?.user?.email;
      (async () => {
         const url = `https://woo-com-serve.herokuapp.com/user/${email}`;

         try {
            if (email) {
               const response = await fetch(url, {
                  method: "PUT"
               });

               if (response.ok) {
                  const resData = await response.json();
                  setToken(resData);
                  document.cookie = `accessToken=${resData?.token}`;
               }
            }
         } catch (error) {
            throw new Error(`Something went wrong ${error}`);
         }
      })();
   }, [user]);

   return [token];
}
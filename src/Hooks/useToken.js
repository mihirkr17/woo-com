import { useEffect, useState } from "react";

export const useToken = (user) => {
   const [token, setToken] = useState(null);
   const email = user?.user?.email;

   useEffect(() => {
      (async () => {
         const url = `https://woo-com-serve.herokuapp.com/user/${email}`;

         if (email) {
            const response = await fetch(url, {
               method: "POST"
            });

            if (response.ok) {
               const resData = await response.json();
               setToken(resData);
               document.cookie = `accessToken=${resData?.token}`;
            }
         }
      })();
   }, [user, email]);

   return { token };
}
import { useEffect, useState } from "react";

export const useToken = (user) => {
   const [token, setToken] = useState(null);
   const uid = user?.uid;
   const displayName = user?.displayName;

   useEffect(() => {
      (async () => {
         const url = 'https://woo-com-serve.herokuapp.com/user?uid=' + uid;

         if (uid) {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  'content-type': 'application/json'
               },
               body: JSON.stringify({ uid, displayName })
            });

            const tokenData = await response.json();
            setToken(tokenData);
         }
      })();
   }, [user, displayName, uid]);

   return token;
}
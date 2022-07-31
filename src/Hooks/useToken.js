import { useEffect, useState } from "react";
import { useBASE_URL } from "../lib/BaseUrlProvider";

export const useToken = (user) => {
   const BASE_URL = useBASE_URL();
   const [token, setToken] = useState(null);

   useEffect(() => {
      const controller = new AbortController();
      const email = user?.user?.email;
      (async () => {
         const url = `${BASE_URL}user/${email}`;

         try {
            if (email) {
               const response = await fetch(url, {
                  method: "PUT",
                  signal: controller.signal
               });

               if (response.status === 400) {
                  return window.location.reload();
               }

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

      return () => controller?.abort();
   }, [user, BASE_URL]);

   return [token];
}
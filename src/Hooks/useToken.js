import { useEffect, useState } from "react";
import { useBASE_URL } from "../lib/BaseUrlProvider";

export const useToken = (user) => {
   const BASE_URL = useBASE_URL();
   const [token, setToken] = useState(null);

   useEffect(() => {
      const controller = new AbortController();
    
      (async () => {
         try {
            if (user) {
               const email = user?.user?.email;
               const url = `${BASE_URL}api/sign-user/${email}`;
               const response = await fetch(url, {
                  method: "PUT",
                  signal: controller.signal
               });

               const resData = await response.json();

               if (response.status === 400) {
                  return window.location.reload();
               }

               if (response.ok) {
                  setToken(resData);
                  if (resData && resData?.token) {
                     document.cookie = `accessToken=${resData?.token}`;
                  }
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
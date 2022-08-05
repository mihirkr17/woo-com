import { useEffect, useState } from "react";
import { useBASE_URL } from "../lib/BaseUrlProvider";

export const useToken = (user) => {
   
   const [token, setToken] = useState(null);

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
   }, [user, ]);

   return [token];
}
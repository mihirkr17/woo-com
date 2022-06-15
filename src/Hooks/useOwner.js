import { useEffect, useState } from 'react';

export const useOwner = (email) => {
   const [owner, setOwner] = useState(false);
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState();

   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   useEffect(() => {
      (async () => {
         try {
            setLoading(true);
            if (email) {
               const response = await fetch(`https://woo-com-serve.herokuapp.com/fetch-owner/${email}`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  }
               });
               const data = await response.json();
               console.log(data.owner);
               data.owner === true ? setOwner(true) : setOwner(false);
            }
         } catch (error) {
            setErr(error);
         } finally {
            setLoading(false);
         }
      })();
   }, [email, token]);

   console.log(owner, loading);

   return { owner, loading, err };
};
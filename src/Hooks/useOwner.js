import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase.init';

const useOwner = (user) => {
   const [owner, setOwner] = useState(false);
   const [ownerLoading, setOwnerLoading] = useState(false);
   const [err, setErr] = useState();

   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   useEffect(() => {
      const controller = new AbortController();

      (async () => {
         try {
            setOwnerLoading(true);
            const email = user?.email;
            if (email) {
               const response = await fetch(`https://woo-com-serve.herokuapp.com/fetch-owner/${email}`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  }
               });

               if (response.status === 401 || response.status === 403) { signOut(auth) };

               if (response.ok) {
                  const data = await response.json();
                  setOwner(data.owner);
               }
            }
         } catch (error) {
            setErr(error);
         } finally {
            setOwnerLoading(false);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [user, token]);

   return [owner, ownerLoading];
};

export default useOwner;
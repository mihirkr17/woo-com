import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase.init';

const useAuth = (user) => {
   const [role, setRole] = useState("");
   const [roleLoading, setRoleLoading] = useState(false);
   const [err, setErr] = useState();

   // get access token from cookies
   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   useEffect(() => {
      const controller = new AbortController();

      (async () => {
         try {
            setRoleLoading(true);
            const email = user?.email;

            if (email && token) {
               const response = await fetch(`https://woo-com-serve.herokuapp.com/fetch-auth/${email}`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  },
                  signal: controller.signal
               });
               if (response.ok) {
                  const data = await response.json();
                  
                  setRole(data.role);
                  setRoleLoading(false);
               } else {
                  signOut(auth);
               }
            }
         } catch (error) {
            setErr(error);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [user, token]);

   return [role, roleLoading, err];
};

export default useAuth;
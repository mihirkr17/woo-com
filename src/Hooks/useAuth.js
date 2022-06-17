import { useEffect, useState } from 'react';

const useAuth = (user) => {
   const [role, setRole] = useState("");
   const [roleLoading, setRoleLoading] = useState(false);
   const [err, setErr] = useState();

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
               } else {
                  throw new Error(`${response.status}, ${response.statusText}`);
               }
            }
         } catch (error) {
            setErr(error);
         } finally {
            setRoleLoading(false);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [user, token]);

   return [role, roleLoading, err];
};

export default useAuth;
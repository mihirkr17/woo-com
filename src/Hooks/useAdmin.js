import { useEffect, useState } from 'react';

const useAdmin = (user) => {
   const [admin, setAdmin] = useState(false);
   const [adminLoading, setAdminLoading] = useState(false);
   const [err, setErr] = useState();

   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   useEffect(() => {
      const controller = new AbortController();

      (async () => {
         try {
            setAdminLoading(true);
            const email = user?.email;
            if (email) {
               const response = await fetch(`https://woo-com-serve.herokuapp.com/fetch-admin/${email}`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  }
               });
               const data = await response.json();
               setAdmin(data.admin);
            }
         } catch (error) {
            setErr(error);
         } finally {
            setAdminLoading(false);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [user, token]);

   return [admin, adminLoading];
};

export default useAdmin;
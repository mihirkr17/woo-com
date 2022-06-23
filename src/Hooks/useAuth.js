import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.init';

const useAuth = (user) => {
   const [role, setRole] = useState("");
   const [roleLoading, setRoleLoading] = useState(false);
   const [err, setErr] = useState();
   const navigate = useNavigate();

   useEffect(() => {
      const controller = new AbortController();
      // get access token from cookies
      const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
      const token = cookieObj.get('accessToken');
      const email = user?.email;

      (async () => {
         try {
            setRoleLoading(true);
            if (email) {
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
                  if (data?.role) {
                     setRole(data.role);
                  } else {
                     setRole({role : "user"})
                  }
                  
                  setRoleLoading(false);
               } else {
                  signOut(auth);
                  navigate('/');
               }
            }

            if (!user) {
               setRole("");
               setRoleLoading(false);
            }
         } catch (error) {
            setErr(error);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [user, navigate]);

   return { role, roleLoading, err };
};

export default useAuth;
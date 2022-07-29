import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.init';
import { useBASE_URL } from '../lib/BaseUrlProvider';

const useAuth = (user) => {
   const BASE_URL = useBASE_URL();
   const [role, setRole] = useState("");
   const [userInfo, setUserInfo] = useState(null || {} || []);
   const [roleLoading, setRoleLoading] = useState(false);
   const [err, setErr] = useState();
   const navigate = useNavigate();
   const [ref, setRef] = useState(false);

   let refetch;
   refetch = () => setRef(e => !e);

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
               const response = await fetch(`${BASE_URL}fetch-auth/${email}`, {
                  method: "GET",
                  headers: {
                     "content-type": "application/json",
                     authorization: `Bearer ${token}`
                  },
                  signal: controller.signal
               });
               if (response.ok) {
                  const data = await response.json();
                  setUserInfo(data?.result);
                  if (data?.role) {
                     setRole(data.role);
                  } else {
                     setRole({ role: "user" })
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
               setUserInfo(null);
            }
         } catch (error) {
            setErr(error);
         }
      })();

      return () => controller?.abort();

   }, [user, navigate, BASE_URL, ref]);

   return { role, roleLoading, err, userInfo, refetch };
};

export default useAuth;
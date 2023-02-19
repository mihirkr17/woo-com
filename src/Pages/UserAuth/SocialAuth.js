import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { auth } from '../../firebase.init';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import BtnSpinner from "../../Components/Shared/BtnSpinner/BtnSpinner";
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';
import { useState } from 'react';

const SocialAuth = () => {
   const { msg, setMessage } = useMessage();
   const [isLogged, setIsLogged] = useState(false);
   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
   const navigate = useNavigate();
   const location = useLocation();
   const { role, authRefetch } = useAuthContext();
   let from = location.state?.from?.pathname || '/';

   useEffect(() => {
      if (role) {
         navigate(from, { replace: true });
      }

      if (isLogged) {
         authRefetch();
      }
   }, [navigate, role, from, authRefetch, isLogged]);

   useEffect(() => {
      if (user) {
         (async () => {
            try {
               const email = user?.user?.email;

               const url = `${process.env.REACT_APP_BASE_URL}api/v1/auth/login`;

               const obj = { emailOrPhone: email, authProvider: 'thirdParty' };

               const response = await fetch(url, {
                  method: 'POST',
                  withCredential: true,
                  credentials: 'include',
                  headers: {
                     "Content-Type": "application/json"
                  },
                  body: JSON.stringify(obj)
               });

               const d = await response.json();

               if (response.ok && d.success) {
                  setIsLogged(true);
               }

            } catch (error) {

            }
         })();
      }
   }, [user]);

   if (error) {
      return setMessage(<strong className='text-danger'>{error?.message}</strong>);
   };

   const socialHandler = async () => {
      try {
         await signInWithGoogle();
      } catch (error) {
         setMessage(<strong className='text-danger'>{error?.message}</strong>);
      }
   }

   return (
      <div>
         {msg}
         <button className='login-with-google-btn' onClick={socialHandler}>
            {loading ? <BtnSpinner text={"Signing..."}></BtnSpinner> : "Sign In With Google"}
            </button>
      </div>
   );
};

export default SocialAuth;
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { auth } from '../../firebase.init';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import BtnSpinner from "../../Components/Shared/BtnSpinner/BtnSpinner";
import { useSignIn } from '../../Hooks/useSignIn';

const SocialAuth = () => {
   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
   const navigate = useNavigate();
   const [isLogged] = useSignIn(user);
   const location = useLocation();
   let from = location.state?.from?.pathname || '/';
   let msg;

   useEffect(() => {
      if (isLogged) { navigate(from, { replace: true }) };
   }, [navigate, isLogged, from]);

   if (error) msg = <strong className='text-danger'>{error?.message}</strong>;

   const socialHandler = async () => {
      await signInWithGoogle();
   }

   return (
      <div>
         {msg}
         <Button variant='info' onClick={socialHandler}>{loading ? <BtnSpinner text={"Signing..."}></BtnSpinner> : "Sign In With Google"}</Button>
      </div>
   );
};

export default SocialAuth;
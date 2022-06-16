import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { auth } from '../../firebase.init';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToken } from '../../Hooks/useToken';
import Spinner from '../../Components/Shared/Spinner/Spinner';

const SocialAuth = () => {
   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
   const navigate = useNavigate();
   const [token] = useToken(user);
   const location = useLocation();
   let from = location.state?.from?.pathname || '/';
   let msg;

   useEffect(() => {
      if (token) { navigate(from, { replace: true }) };
   }, [navigate, token, from]);

   if (loading) return <Spinner></Spinner>;

   if (error) msg = <strong className='text-danger'>{error?.message}</strong>;

   const socialHandler = async () => {
      await signInWithGoogle();
   }

   return (
      <div>
         {msg}
         <Button variant='info' onClick={socialHandler}>Sign in with Google</Button>
      </div>
   );
};

export default SocialAuth;
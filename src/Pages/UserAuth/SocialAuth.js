import React from 'react';
import { Button } from 'react-bootstrap';
import { auth } from '../../firebase.init';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import {useNavigate} from 'react-router-dom';

const SocialAuth = () => {
   const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
   const navigate = useNavigate();

   if (user) {
      navigate('/');
   }

   const socialHandler = async () => {
      await signInWithGoogle();
   }

   return (
      <div>
         <Button onClick={socialHandler}>Sign in with Google</Button>
      </div>
   );
};

export default SocialAuth;
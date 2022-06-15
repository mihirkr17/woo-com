import { signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { auth } from '../firebase.init';
import { useOwner } from '../Hooks/useOwner';

const RequireOwner = ({ children }) => {
   const [user, loading] = useAuthState(auth);
   const { owner, loading: ownerLoading } = useOwner(user?.email);
   const location = useLocation();

   if (loading || ownerLoading) {
      return <Spinner></Spinner>;
   }

   if (owner === false || !user) {
      signOut(auth)
      return <Navigate to='/login' state={{ from: location }} replace></Navigate>;
   }

   return children;
};

export default RequireOwner;
import React from 'react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { auth } from '../firebase.init';
import useAuth from '../Hooks/useAuth';

const RequireOwnerAdmin = ({ children }) => {
   const [user, loading] = useAuthState(auth);
   const { role } = useAuth(user);
   const location = useLocation();

   if (loading) {
      return <Spinner></Spinner>;
   }

   if ((role !== "owner" && role !== "admin") && !user) {
      signOut(auth);
      return <Navigate to='/login' state={{ from: location }} replace></Navigate>;
   }
   return children;
};

export default RequireOwnerAdmin;
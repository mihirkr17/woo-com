import React from 'react';
import { auth } from '../firebase.init';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Spinner } from 'react-bootstrap';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
   const [user, loading] = useAuthState(auth);
   const location = useLocation();

   if (loading) return <Spinner></Spinner>;

   if (!user) {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
   }

   return children;
};

export default RequireAuth;
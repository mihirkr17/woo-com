import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useAuthContext } from '../lib/AuthProvider';

const RequireAuth = ({ children }) => {
   const { role, authLoading } = useAuthContext();
   const location = useLocation();

   if (authLoading) {
      return <Spinner/>;
   }

   if (role) {
      return children;
   }

   else {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
   }
};

export default RequireAuth;
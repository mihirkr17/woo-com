import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredAdmin = ({ children }) => {
   const { role, authLoading } = useAuthContext();
   const location = useLocation();

   if (authLoading) {
      return <Spinner />;
   }

   if (role) {
      if (role === 'ADMIN') {
         return children;
      }

      return <Navigate to={'/'} state={{ from: location }} replace></Navigate>;
   }

   return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
};

export default RequiredAdmin;
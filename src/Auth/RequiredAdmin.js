import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredAdmin = ({ children }) => {
   const { role, authLoading } = useAuthContext();
   const location = useLocation();

   if (role) {
      if (role === 'ADMIN') {
         return children;
      }

      return <Navigate to={'/'} state={{ from: location }} replace></Navigate>;
   } else if (authLoading) {
      return false;
   } else {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
   }

   
};

export default RequiredAdmin;
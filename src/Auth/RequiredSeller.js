import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredSeller = ({ children }) => {
   const { role } = useAuthContext();
   const location = useLocation();

   if (role) {
      if (role === 'SELLER') {
         return children;
      }
      return <Navigate to={'/'} state={{ from: location }} replace></Navigate>;
   }

   return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
};

export default RequiredSeller;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredDashboard = ({ children }) => {
   const { role, authLoading } = useAuthContext();

   const location = useLocation();

   if (role) {
      if (role === 'OWNER' || role === 'ADMIN' || role === 'SELLER') {
         return children;
      }
   } else if (authLoading) {
      return false;
   } else {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
   }
};

export default RequiredDashboard;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const NotPermitFor = ({ children }) => {
   const { role } = useAuthContext();
   const location = useLocation();


   if (role) {
      if (role === 'owner' || role === 'admin' || role === 'seller') {
         return <Navigate to='/dashboard' state={{ from: location }} replace />
      }
      return children;
   }
   
   return children;
};

export default NotPermitFor;
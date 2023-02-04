import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const NotPermitForAdminSellerOwner = ({ children }) => {
   const { role } = useAuthContext();
   const location = useLocation();


   if (role) {
      if (role === 'OWNER' || role === 'ADMIN' || role === 'SELLER') {
         return <Navigate to='/dashboard' state={{ from: location }} replace />
      }
      return children;
   }
   
   return children;
};

export default NotPermitForAdminSellerOwner;
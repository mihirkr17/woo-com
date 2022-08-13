import React from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredOwnerAdmin = ({ children }) => {
   const { role, authLoading } = useAuthContext();

   if (authLoading) return <Spinner />;

   if (role) {
      if (role === "owner" || role === "admin") {
         return children;
      } else {
         return <Navigate to={'/'} replace></Navigate>;
      }
   }
};

export default RequiredOwnerAdmin;
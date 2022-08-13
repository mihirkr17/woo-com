import React from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredSeller = ({ children }) => {

   const { role, authLoading } = useAuthContext();

   if (authLoading) return <Spinner />;

   if (role) {
      if (role === "seller") {
         return children;
      } else {
         return <Navigate to={'/'} replace></Navigate>;
      }
   }
};

export default RequiredSeller;
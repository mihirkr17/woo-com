import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredUser = ({children}) => {
   const { role } = useAuthContext();

   if (role) {
      if (role === "user") {
         return children;
      } else {
         return <Navigate to={'/'} replace></Navigate>;
      }
   }
};

export default RequiredUser;
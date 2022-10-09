import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../lib/AuthProvider';

const RequiredUser = ({ children }) => {
   const { role } = useAuthContext();
   const location = useLocation();

   if (role && role === "user") {
      return children;
   } else  {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
   }
};

export default RequiredUser;
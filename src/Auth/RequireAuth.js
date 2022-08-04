import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '../App';

const RequireAuth = ({ children }) => {
   const user = useAuthUser();
   const location = useLocation();

   if (!user) {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
   }

   return children;
};

export default RequireAuth;
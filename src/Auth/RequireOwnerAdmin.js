import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '../App';
import Spinner from '../Components/Shared/Spinner/Spinner';
import useAuth from '../Hooks/useAuth';
import { loggedOut } from '../Shared/common';

const RequireOwnerAdmin = ({ children }) => {
   const user = useAuthUser();
   const { role, authLoading } = useAuth(user);
   const location = useLocation();

   if (authLoading) return <Spinner />; 

   if (!user) {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
   }

   if (role) {
      if (role !== "owner" && role !== "admin" && role === "user" && role !== "seller") {
         (async () => loggedOut())();
         return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
      }
      return children;
   }
};

export default RequireOwnerAdmin;
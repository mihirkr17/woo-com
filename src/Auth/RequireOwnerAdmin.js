import React from 'react';
import { signOut } from 'firebase/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase.init';
import useAuth from '../Hooks/useAuth';
import { useAuthUser } from '../lib/UserProvider';

const RequireOwnerAdmin = ({ children }) => {
   const user = useAuthUser();
   const { role, userInfo } = useAuth(user);
   const location = useLocation();

   if (!user) {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
   }

   if (role) {
      if (role !== "owner" && role !== "admin" && role === "user" && role !== "seller") {
         signOut(auth);
         return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
      }
      return children;
   }
};

export default RequireOwnerAdmin;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '../App';
import Spinner from '../Components/Shared/Spinner/Spinner';
import useAuth from '../Hooks/useAuth';

const RequireOwnerAdmin = ({ children }) => {
   const user = useAuthUser();
   const { role, authLoading } = useAuth(user);
   const location = useLocation();

   if (authLoading) return <Spinner />; 

   if (!user) {
      return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;
   }

   if (role) {
      if (role === "user") return <Navigate to={`/`} replace/> 

      if (role !== "owner" && role !== "admin" && role !== "seller") {
         return <Navigate to={'/'} state={{ from: location }} replace></Navigate>
      } else {
         return children;
      }
   }
};

export default RequireOwnerAdmin;
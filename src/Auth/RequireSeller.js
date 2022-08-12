import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthUser } from '../App';
import Spinner from '../Components/Shared/Spinner/Spinner';
import useAuth from '../Hooks/useAuth';

const RequireSeller = ({ children }) => {
   const user = useAuthUser();
   const { role, authLoading } = useAuth(user);

   if (authLoading) return <Spinner />
   if (role && (role !== "seller")) return <Navigate to={`/`} replace />;
   if (role && (role === "seller")) return children;
};

export default RequireSeller;
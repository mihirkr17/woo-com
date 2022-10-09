import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import Spinner from '../Components/Shared/Spinner/Spinner';
import useAuth from '../Hooks/useAuth';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

   const { role, userInfo, authRefetch, authLoading } = useAuth();

   if (authLoading) {
      return <Spinner />;
   } else {
      return (
         <AuthContext.Provider value={{ role, userInfo, authRefetch, authLoading }}>
            {children}
         </AuthContext.Provider>
      )
   }
};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
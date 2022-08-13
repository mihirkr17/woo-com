import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useAuthUser } from '../App';
import useAuth from '../Hooks/useAuth';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   const user = useAuthUser();
   const { role, userInfo, authRefetch, authLoading } = useAuth(user);

   return (
      <AuthContext.Provider value={{ role, userInfo, authRefetch, authLoading }}>
         {children}
      </AuthContext.Provider>
   )
};
export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
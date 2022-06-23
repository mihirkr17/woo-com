import { signOut } from 'firebase/auth';
import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { auth } from '../firebase.init';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
   const [user, loading] = useAuthState(auth);
   if (loading) {
      return <Spinner></Spinner>;
   }
   return (
      <UserContext.Provider value={user}>
         {children}
      </UserContext.Provider>
   )
};

export const useAuthUser = () => useContext(UserContext);
export const useSignOut = () => signOut(auth);

export default UserProvider;
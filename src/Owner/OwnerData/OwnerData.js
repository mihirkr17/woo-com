import { signOut } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import useAuth from '../../Hooks/useAuth';

const OwnerData = () => {
   const [user] = useAuthState(auth);
   const [role] = useAuth(user);
   if (role !== "" && role !== "owner") {
      signOut(auth);
   };
   
   return (
      <div>
         this is owner data
      </div>
   );
};

export default OwnerData;
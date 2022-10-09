import React from 'react';
import { useAuthContext } from '../../lib/AuthProvider';

const Logout = () => {
   const { authRefetch } = useAuthContext();
   let authLogout;

   authLogout()
 

};

export default Logout;
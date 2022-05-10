import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const Login = () => {
   const { loginWithRedirect } = useAuth0();

   // const handleSubmit = async (e) => {
   //    e.preventDefault();

   //    let username = e.target.username.value;
   //    let password = e.target.password.value;
   // }
   return (

      <button onClick={() => loginWithRedirect()}>login</button>

   );
};

export default Login;
import React, { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Shared/Spinner/Spinner';
import { auth } from '../firebase.init';
import { useToken } from '../Hooks/useToken';

const Register = () => {
   const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
   const [updateProfile, updating, error2] = useUpdateProfile(auth);
   const [token] = useToken(user);
   const navigate = useNavigate();
   let msg;

   useEffect(() => {
      if (token) navigate('/login');
   }, [navigate, token]);

   if (loading || updating) return <Spinner></Spinner>;
   if (error || error2) msg = <strong className="text-danger">{error?.message}</strong>

   const handleRegister = async (e) => {

      e.preventDefault();
      let username = e.target.username.value;
      let email = e.target.email.value;
      let password = e.target.password.value;

      await createUserWithEmailAndPassword(email, password);
      await updateProfile({ displayName: username });
   }
   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-lg-5 mx-auto">
                  <h3>Register</h3>
                  {msg}
                  <Form onSubmit={handleRegister}>
                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name='username' placeholder="Enter your name" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name='email' placeholder="Enter email" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' placeholder="Password" />
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                     </Form.Group>
                     <Button variant="primary" type="submit">
                        Submit
                     </Button>
                  </Form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Register;
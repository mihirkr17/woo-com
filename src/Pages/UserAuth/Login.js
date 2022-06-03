import React, { useEffect } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useToken } from '../../Hooks/useToken';
import SocialAuth from './SocialAuth';

const Login = () => {
   const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);
   const navigate = useNavigate();
   const location = useLocation();
   const [token] = useToken(user);
   let from = location.state?.from?.pathname || '/';
   let msg;
   
   useEffect(() => {
      if (token) navigate(from, { replace: true });
   }, [navigate, token, from]);

   if (loading) return <Spinner></Spinner>;
   if (error) msg = <strong className="text-danger">{error?.message}</strong>

   const handleLogin = async (e) => {
      e.preventDefault();
      let email = e.target.email.value;
      let password = e.target.password.value;
      await signInWithEmailAndPassword(email, password);
   }

   return (
      <div>
         <Container>
            <Row>
               <div className="col-lg-4 mx-auto text-center">
                  <h3 className='py-5'>Login to WOO-COM</h3>
                  {msg}
                  <Form onSubmit={handleLogin}>

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

                  <Link to={'/register'}>Go Register</Link>

                  <SocialAuth></SocialAuth>
               </div>
            </Row>
         </Container>
      </div>
   );
};

export default Login;
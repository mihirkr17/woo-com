import React, { useEffect } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { auth } from '../../firebase.init';
import { useMessage } from '../../Hooks/useMessage';
import { useSignIn } from '../../Hooks/useSignIn';
// import { useToken } from '../../Hooks/useToken';
import SocialAuth from './SocialAuth';

const Login = () => {
   const { msg: logMsg, setMessage } = useMessage();
   const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);
   const navigate = useNavigate();
   const location = useLocation();
   const [isLogged] = useSignIn(user);
   let from = location.state?.from?.pathname || '/';
   let msg;

   useEffect(() => {
      if (isLogged) navigate(from, { replace: true });
   }, [navigate, isLogged, from]);

   if (error) msg = <strong className="text-danger">{error?.message}</strong>

   const handleLogin = async (e) => {
      e.preventDefault();
      let email = e.target.email.value;
      let password = e.target.password.value;

      if (email === "" || password === "") {
         setMessage(<small><strong className="text-danger py-2">Please fill up all input fields!</strong></small>);
      } else {
         await signInWithEmailAndPassword(email, password);
      }
   }

   return (
      <div className='section_default' style={{ height: "90vh" }}>
         <Container>
            <Row>
               <div className="col-lg-4 mx-auto">
                  <div className="card text-center shadow py-3">
                     <div className="card-body">
                        <h3 className='py-5'>Login to WOO-COM</h3>
                        {msg || logMsg}
                        <Form onSubmit={handleLogin} className='text-start'>
                           <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control type="email" name='email' autoComplete='off' placeholder="Enter your email" />
                           </Form.Group>

                           <Form.Group className="mb-3" controlId="formBasicPassword">
                              <Form.Label>Password</Form.Label>
                              <Form.Control type="password" name='password' autoComplete='off' placeholder="Enter your password" />
                           </Form.Group>
                           <Form.Group>
                              <Button className='btn-sm' variant="primary" type="submit">
                                 {loading ? <BtnSpinner text={"Signing..."}></BtnSpinner> : "Login"}
                              </Button>
                           </Form.Group>
                        </Form>

                        <div className="my-3">
                           <span>New to Woo-Com ?&nbsp;</span>
                           <Link to={'/register'}>Register</Link>
                        </div>

                        <SocialAuth></SocialAuth>
                     </div>
                  </div>
               </div>
            </Row>
         </Container>
      </div>
   );
};

export default Login;
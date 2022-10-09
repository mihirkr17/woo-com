import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';
import SocialAuth from './SocialAuth';

const Login = () => {
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();
   const location = useLocation();
   let from = location.state?.from?.pathname || '/';
   const { authRefetch, role } = useAuthContext();
   const [loading, setLoading] = useState(false);
   const queryParams = new URLSearchParams(window.location.search);
   const term = queryParams.get("err");
   const sTerm = queryParams.get('authenticate');

   useEffect(() => {
      if (role) {
         navigate(from, { replace: true });
      }
   }, [navigate, role, from]);

   const handleLogin = async (e) => {
      try {
         setLoading(true);
         e.preventDefault();
         let username = e.target.email.value;
         let password = e.target.password.value;

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/login-user`, {
            method: "POST",
            withCredential: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
         });

         setLoading(false);
         const d = await response.json();

         if (!response.ok) {
            setMessage(d?.error, 'danger');
         }

         if (response.ok) {
            authRefetch();
         }
      } catch (error) {

      } finally {
         setLoading(false);
      }
   }

   return (
      <div className='section_default' style={{ height: "90vh" }}>
         <Container>
            <div className="auth_container">
               <div className="ac_left">
                  <div className="ac_overlay">
                     <h1>WooKart</h1>
                     <p>
                        Get access to your Orders, Wishlist and Recommendations
                     </p>
                  </div>
               </div>


               <div className="ac_right">
                  <h5>Login</h5>
                  <p>Don't have an account?
                     &nbsp;<Link to={'/register'}>Create Your Account</Link>&nbsp;
                     it takes less than a minute
                  </p>

                  {msg}

                  <Form onSubmit={handleLogin} className='text-start'>
                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username Or Email address</Form.Label>
                        <Form.Control type="text" name='email' defaultValue={sTerm || ""} autoComplete='off' placeholder="Enter your email" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' autoComplete='off' placeholder="Enter your password" />
                     </Form.Group>
                     <Form.Group>
                        <button className='bt9_auth' type="submit">
                           {loading ? <BtnSpinner text={"Signing..."}></BtnSpinner> : "Login"}
                        </button>
                     </Form.Group>
                  </Form>
                  <br /><br />
                  <SocialAuth></SocialAuth>
               </div>

            </div>
         </Container>
      </div>
   );
};

export default Login;
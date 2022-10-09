import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from "../Components/Shared/BtnSpinner/BtnSpinner";

import { useMessage } from '../Hooks/useMessage';


const Register = () => {
   const { msg, setMessage } = useMessage();
   const [loading, setLoading] = useState(false);
   const [accept, setAccept] = useState(false);
   const navigate = useNavigate();

   async function handleRegister(e) {
      try {
         e.preventDefault();
         setLoading(true);

         let formData = new FormData(e.currentTarget);

         formData = Object.fromEntries(formData.entries());

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/register-user`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
         });

         setLoading(false);

         const data = await response.json();

         if (!response.ok) {
            setMessage(data?.error, 'danger');
            return;
         }

         navigate(`/login?authenticate=${data?.data?.username}`);


      } catch (error) {
         setMessage(error?.message, 'danger');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className='section_default' style={{ height: "90vh" }}>

         <div className="container">
            <div className="auth_container">
               <div className="ac_left">
                  <div className="ac_overlay">
                     <h1>WooKart</h1>
                     <p>
                        Sign up with your email & username to get started
                     </p>
                  </div>
               </div>
               <div className="ac_right">
                  <h5>Register</h5>
                  <p>Already have an account?
                     &nbsp;<Link to={'/login'}>Go To Login</Link>&nbsp;
                     it takes less than a minute
                  </p>
                  {msg}

                  <Form onSubmit={handleRegister}>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name='username' autoComplete='off' placeholder="Enter username!!!" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name='email' autoComplete='off' placeholder="Enter email address!!!" />
                     </Form.Group>

                     <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' autoComplete='off' placeholder="Please enter password !!!" />
                     </Form.Group>

                     <Form.Group className="mb-3 text-muted" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" onChange={() => setAccept(e => !e)} label="Accept our terms & condition ?" />
                     </Form.Group>

                     <Form.Group>
                        <Button id="submit_btn" variant="primary" className='bt9_auth' disabled={accept === false ? true : false} type="submit">
                           {loading ? <BtnSpinner text={"Registering..."}></BtnSpinner> : "Register"}
                        </Button>
                     </Form.Group>

                  </Form>
               </div>
            </div>
         </div>
      </div >
   );
};

export default Register;
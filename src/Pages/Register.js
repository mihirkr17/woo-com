import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from "../Components/Shared/BtnSpinner/BtnSpinner";
import { auth } from '../firebase.init';
import { useMessage } from '../Hooks/useMessage';
import { useSignIn } from '../Hooks/useSignIn';
// import { useToken } from '../Hooks/useToken';

const Register = () => {
   const { msg: regMsg, setMessage } = useMessage();
   const [acc, setAcc] = useState(false);
   const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
   const [updateProfile, updating, error2] = useUpdateProfile(auth);
   const [isLogged] = useSignIn(user);
   const navigate = useNavigate();
   let msg;

   useEffect(() => {
      if (isLogged) navigate('/login');
   }, [navigate, isLogged]);

   if (error || error2) msg = <strong className="text-danger">{error?.message}</strong>

   const handleRegister = async (e) => {

      e.preventDefault();
      let username = e.target.username.value;
      let email = e.target.email.value;
      let password = e.target.password.value;

      if (username === "" || email === "" || password === "") {
         setMessage(<small><strong className="text-danger py-2">Please fill up all input fields!</strong></small>);
      } else {
         await createUserWithEmailAndPassword(email, password);
         await updateProfile({ displayName: username });
      }
   }
   return (
      <div className='section_default' style={{ height: "90vh" }}>
         <div className="container">
            <div className="row">
               <div className="col-lg-4 mx-auto">
                  <div className="card py-3 shadow">
                     <div className="card-body">
                        <h3>Register</h3>
                        {msg || regMsg}
                        <Form onSubmit={handleRegister}>
                           <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>Username</Form.Label>
                              <Form.Control type="text" name='username' autoComplete='off' placeholder="Enter your name" />
                           </Form.Group>

                           <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control type="email" name='email' autoComplete='off' placeholder="Enter your email" />
                           </Form.Group>

                           <Form.Group className="mb-3" controlId="formBasicPassword">
                              <Form.Label>Password</Form.Label>
                              <Form.Control type="password" name='password' autoComplete='off' placeholder="Enter your password" />
                           </Form.Group>
                           <Form.Group className="mb-3 text-muted" controlId="formBasicCheckbox">
                              <Form.Check type="checkbox" onChange={() => setAcc(e => !e)} label="Accept our terms & condition ?" />
                           </Form.Group>
                           <Form.Group>
                              <Button variant="primary" className='btn-sm' disabled={acc === false ? true : false} type="submit">
                                 {loading || updating ? <BtnSpinner text={"Registering..."}></BtnSpinner> : "Register"}
                              </Button>
                           </Form.Group>
                        </Form>
                        <div className="py-3 text-center">
                           <span>Already Have A Account ? &nbsp;</span>
                           <Link to='/login'>Login</Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div >
   );
};

export default Register;
import React from 'react';
import { Button, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import SocialAuth from './SocialAuth';

const Login = () => {

   const loginHandler = () => {

   }

   return (
      <div>
         <Container>
            <Row>
               <div className="col-lg-6 mx-auto text-center">
                  <h3 className='py-5'>Login to WOO-COM</h3>
                  <Form onSubmit={loginHandler}>
                     <FloatingLabel
                        controlId="floatingInput"
                        label="Email address"
                        className="mb-3"
                     >
                        <Form.Control type="email"  placeholder="name@example.com" />
                     </FloatingLabel>
                     <FloatingLabel controlId="floatingPassword" label="Password">
                        <Form.Control type="password" placeholder="Password" />
                     </FloatingLabel>

                     <Button type='submit' className='my-4'>Login</Button>
                  </Form>

                  <SocialAuth></SocialAuth>
               </div>
            </Row>
         </Container>
      </div>
   );
};

export default Login;
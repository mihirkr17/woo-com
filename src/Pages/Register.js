import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BtnSpinner from "../Components/Shared/BtnSpinner/BtnSpinner";
import { useMessage } from '../Hooks/useMessage';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VerifyAuthToken from './UserAuth/VerifyAuthToken';
import { emailValidator } from '../Shared/common';


const Register = () => {
   const { msg, setMessage } = useMessage();
   const [loading, setLoading] = useState(false);
   const [accept, setAccept] = useState(false);
   const [showPwd, setShowPwd] = useState(false);
   const [isVToken, setIsVToken] = useState(false);
   const [verifyToken, setVerifyToken] = useState(undefined);
   const navigate = useNavigate();

   useEffect(() => {
      let verifyTok = document.cookie.split('; ').find(e => e.startsWith('verifyToken='))?.split('=')[1];
      setVerifyToken(verifyTok);

   }, [isVToken]);

   async function handleRegister(e) {
      try {
         e.preventDefault();
         setLoading(true);

         let formData = new FormData(e.currentTarget);

         formData = Object.fromEntries(formData.entries());

         const { username, email, password } = formData;

         if (username.length <= 0) {
            return setMessage('Username required !!!', 'danger');
         }

         else if (email.length <= 0) {
            return setMessage('Email address required !!!', 'danger');
         }

         else if (!emailValidator(email)) {
            return setMessage('Invalid email address !!!', 'danger');
         }

         else if (password.length <= 0) {
            return setMessage('Email address required !!!', 'danger');
         }

         else if (password.length <= 4 && password.length >= 10) {
            return setMessage('Password must be greater than 5 characters !!!', 'danger');
         }

         // if all input fields validate then call the api request
         else {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/register-user`, {
               method: "POST",
               withCredential: true,
               credentials: 'include',
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

            setIsVToken(true);
            return;
         }

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
                  {
                     verifyToken ? <VerifyAuthToken vToken={verifyToken} setMessage={setMessage} navigate={navigate} /> :
                        <form onSubmit={handleRegister}>

                           <div className="mb-3">
                              <label htmlFor='username'>Username</label>
                              <input className='form-control' id='username' type="text" name='username' autoComplete='off' placeholder="Enter username!!!" />
                           </div>

                           <div className="mb-3">
                              <label htmlFor='email'>Email address</label>
                              <input className='form-control' id='email' type="email" name='email' autoComplete='off' placeholder="Enter email address!!!" />
                           </div>

                           <div className="mb-3 input_group">
                              <label htmlFor='password'>Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input className='form-control' type={showPwd ? "text" : "password"} name='password' id='password' autoComplete='off' placeholder="Please enter password !!!" />
                                 <span style={{
                                    transform: "translateY(-50%)",
                                    position: "absolute",
                                    right: "2%",
                                    top: "50%"
                                 }} className='bt9' onClick={() => setShowPwd(e => !e)}>
                                    {showPwd ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                 </span>
                              </div>
                           </div>

                           <div className="mb-3 text-muted">
                              <input type="checkbox" id='accept_terms' onChange={() => setAccept(e => !e)} />
                              &nbsp;
                              <label htmlFor="accept_terms">Accept our terms & condition ?</label>
                           </div>

                           <button id="submit_btn" className='bt9_auth' disabled={accept === false ? true : false} type="submit">
                              {loading ? <BtnSpinner text={"Registering..."}></BtnSpinner> : "Register"}
                           </button>


                        </form>
                  }
               </div>
            </div>
         </div>
      </div >
   );
};

export default Register;
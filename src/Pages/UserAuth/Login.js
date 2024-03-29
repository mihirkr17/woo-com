import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';
import { useAuthContext } from '../../lib/AuthProvider';
import SocialAuth from './SocialAuth';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useBaseContext } from '../../lib/BaseProvider';

const Login = () => {
   const { setMessage } = useBaseContext();
   const [showPwd, setShowPwd] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();
   let from = location.state?.from?.pathname + (location.state?.from?.search && location.state?.from?.search) || '/';
   const { authRefetch, role } = useAuthContext();
   const [loading, setLoading] = useState(false);
   const queryParams = new URLSearchParams(window.location.search);
   const sTerm = queryParams.get('authenticate');
   const [verifyToken, setVerifyToken] = useState(undefined);

   useEffect(() => {
      if (role) {
         navigate(from, { replace: true });
      }
   }, [navigate, role, from]);

   const handleLogin = async (e) => {
      try {
         setLoading(true);
         e.preventDefault();
         let emailOrPhone = e.target.emailOrPhone.value;
         let password = e.target.password.value;
         let verify_token;

         if (verifyToken) {
            verify_token = e.target.verify_token.value;
         }

         if (emailOrPhone.length <= 0) {
            return setMessage('Phone or email address required !!!', 'danger');
         }

         else if (password.length <= 0) {
            return setMessage('Password required !!!', 'danger');
         }

         else {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/auth/login`, {
               method: "POST",
               withCredentials: true,
               credentials: 'include',
               headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${verify_token}`
               },
               body: JSON.stringify({ emailOrPhone, password })
            });

            setLoading(false);

            const { name, uuid, message } = await response.json();

            let verifyTok = document.cookie.split('; ').find(e => e.startsWith('verifyToken='))?.split('=')[1];

            setVerifyToken(verifyTok);

            if (!response.ok) {
               return setMessage(message, 'danger');
            }

            if (name === 'isLogin' && uuid) {
               localStorage.setItem("uuid", uuid);
               authRefetch();
            }
         }

      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className='section_default' style={{ height: "90vh" }}>
         <div className='container'>
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

                  <form onSubmit={handleLogin} className='text-start'>
                     <div className="mb-3 input_group">
                        <label htmlFor='emailOrPhone'>Email address or phone</label>
                        <input className='form-control' type="text" name='emailOrPhone' id='emailOrPhone' defaultValue={sTerm || ""} autoComplete='off' placeholder="Enter your email or phone" />
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
                     {
                        verifyToken && <div className='mb-3'>
                           <div style={{
                              width: "fit-content",
                              height: "40px",
                              border: "2px solid gray",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              letterSpacing: "2px",
                              fontVariantNumeric: "diagonal-fractions",
                              padding: "0.5rem",
                           }}>{verifyToken}</div>
                           <br />
                           <input className='form-control' type="text" name='verify_token' id='verify_token' placeholder="Enter token" />
                        </div>
                     }
                     <div className='mb-3 input_group'>
                        <button className='bt9_auth' type="submit">
                           {loading ? <BtnSpinner text={"Signing..."}></BtnSpinner> : "Login"}
                        </button>
                     </div>
                  </form>


                  <br /><br />
                  <SocialAuth></SocialAuth>
               </div>

            </div>
         </div>
      </div>
   );
};

export default Login;
import React, { useState } from 'react';
import BtnSpinner from '../../Components/Shared/BtnSpinner/BtnSpinner';

const VerifyAuthToken = ({ vToken, setMessage, navigate }) => {
   const [loading, setLoading] = useState(false);

   async function handleVerifyAuthToken(e) {
      try {
         e.preventDefault();
         setLoading(true);

         let verifyToken = e.target.verify_token.value;

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/auth/verify-register-user`, {
            method: "POST",
            withCredentials: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json",
               authorization: `Bearer ${verifyToken}`
            }
         });

         setLoading(false);
         const data = await response.json();

         if (!response.ok) {
            setMessage(data?.error, 'danger');
            return;
         }

         navigate(`/login?authenticate=${data?.data?.email}`);

      } catch (error) {

      }
   }

   return (
      <form onSubmit={handleVerifyAuthToken}>
         <div className="mb-3">
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
            }}>{vToken}</div>
            <br />
            <input className='form-control' type="text" id='verify_token' name='verify_token' autoComplete='off' placeholder="Enter upper provided token here!!!" />
         </div>

         <button id="submit_btn" variant="primary" className='bt9_auth' type="submit">
            {loading ? <BtnSpinner text={"Verifying..."}></BtnSpinner> : "Verify"}
         </button>
      </form>
   );
};

export default VerifyAuthToken;
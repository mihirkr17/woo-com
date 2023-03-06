import React, { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';

const Profile = () => {
   const { msg, setMessage } = useMessage();
   const { userInfo, authRefetch } = useAuthContext();
   const [openProfileUpdateForm, setOpenProfileUpdateForm] = useState(false);
   const [inputs, setInputs] = useState({ fullName: userInfo?.fullName, dob: userInfo?.dob, gender: userInfo?.gender } || {});

   async function submitProfileData() {
      try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/update-profile-data`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: userInfo?.email
            },
            body: JSON.stringify(inputs)
         });

         const data = await response.json();

         if (response.ok) {
            setMessage(data?.message, 'success');

            setTimeout(() => {
               authRefetch();
            }, 1000);
            return;
         }

         setMessage(data?.message, 'danger');

      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }

   return (
      <div className='container'>
         <h5 className='py-4 text-start'>My Profile</h5>

         {msg}
         <div className="row">
            <div className="col-lg-12">
               <ul className='my-profile'>
                  <li>
                     <h6>Full Name</h6>

                     {
                        openProfileUpdateForm ?
                           <input onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} type="text" name='fullName' id='fullName' defaultValue={userInfo?.fullName || ""} /> :
                           <span>{userInfo?.fullName}</span>
                     }
                  </li>
                  <li>
                     <h6>Gender</h6>
                     {
                        openProfileUpdateForm ?
                           <select name="gender" id="gender" onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}>
                              {
                                 userInfo?.gender && <option value={userInfo?.gender}>{userInfo?.gender}</option>
                              }
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Others">Others</option>
                           </select> :
                           <span>{userInfo?.gender}</span>
                     }
                  </li>
                  <li>
                     <h6>Date Of Birth</h6>
                     {
                        openProfileUpdateForm ?
                           <input onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} type="date" name="dob" id="dob" defaultValue={userInfo?.dob || ""} />
                           : <span>{userInfo?.dob}</span>
                     }

                  </li>
                  <li>
                     <h6>Email</h6>
                     <span>{userInfo?.email}</span>
                  </li>
               </ul>
            </div>

            <div className="col-12 pt-5">
               {
                  openProfileUpdateForm ?
                     <>
                        <button className="bt9_edit me-2" onClick={submitProfileData}>
                           Save Change
                        </button>
                        <button className="bt9_cancel" onClick={() => setOpenProfileUpdateForm(false)}>
                           Cancel
                        </button>
                     </> :
                     <>
                        <button className="bt9_edit" onClick={() => setOpenProfileUpdateForm(true)}>
                           Edit Profile
                        </button>

                        <br />
                        <br />
                        {
                           userInfo?.authProvider === "system" && <button className="bt9_edit" onClick={() => setOpenProfileUpdateForm(true)}>
                              Change Password
                           </button>
                        }</>
               }


            </div>
         </div>
      </div>
   );
};

export default Profile;
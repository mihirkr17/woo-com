import React from 'react';
import { useFetch } from '../../../Hooks/useFetch';
import { useState } from 'react';
import "./MyProfile.css";
import UpdateForm from './Components/UpdateForm';
import { useAuthUser } from '../../../lib/UserProvider';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';


const MyProfile = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const [openEdit, setOpenEdit] = useState(false);
   const { data, refetch } = useFetch(`${BASE_URL}my-profile/${user?.email}`);
   const [country, setCountry] = useState(data?.country);
   const [dob, setDob] = useState(data?.dob);
   const [age, setAge] = useState(data?.age);
   const [actionLoading, setActionLoading] = useState(false);

   // open edit form
   const openEditForm = async (params) => {
      if (params === openEdit) {
         setOpenEdit(false);
      } else {
         setOpenEdit(params);
      }
   }

   // common function for updating single value
   const updateDocHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      let dataModel = {
         country: country,
         dob: dob,
         age: age
      }

      const response = await fetch(`${BASE_URL}update-profile-data/${user?.email}`, {
         method: "PUT",
         headers: {
            "content-type": "application/json"
         },
         body: JSON.stringify(dataModel)
      });

      if (response.ok) {
         setActionLoading(false);
         await response.json();
         refetch();
      } else {
         setActionLoading(false);
      }
   }


   return (
      <div className='section_default'>
         <div className="container">

            <div className="profile_heder d-flex align-items-center justify-content-between py-3">
               <h5>My profile</h5>
               <p>Balance : ${data?.total_earn || 0}</p>
            </div>
            <div className="row">
               <div className="col-12">

                  <table className='table table-responsive'>
                     <thead>
                        <tr>
                           <th>Information</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <th>ID</th>
                           <td>{data?._id}</td>
                        </tr>
                        <tr>
                           <th>Email</th>
                           <td>{data?.email}</td>
                        </tr>
                        <tr>
                           <th>Role</th>
                           <td>{data?.role}</td>
                        </tr>
                        <tr>
                           <th>Country</th>
                           <td>
                              <div className="d-flex align-items-center justify-content-between">
                                 <p>{data?.country || "empty"}</p>
                                 <button onClick={() => openEditForm(data?.country)} className='bt9_change'>{openEdit === data?.country ? "Cancel" : "Edit"}</button>
                              </div>

                              <UpdateForm type={'text'}
                                 defaultValue={data?.country}
                                 actionLoading={actionLoading}
                                 getValue={setCountry}
                                 updateDocHandler={updateDocHandler}
                                 openEdit={openEdit}
                              />
                           </td>
                        </tr>
                        <tr>
                           <th>DOB</th>
                           <td>
                              <div className="d-flex align-items-center justify-content-between">
                                 <p>{data?.dob || "empty"}</p>
                                 <button onClick={() => openEditForm(data?.dob)} className='bt9_change'>{openEdit === data?.dob ? "Cancel" : "Edit"}</button>
                              </div>

                              <UpdateForm type={'date'}
                                 defaultValue={data?.dob}
                                 actionLoading={actionLoading}
                                 getValue={setDob}
                                 updateDocHandler={updateDocHandler}
                                 openEdit={openEdit}
                              />
                           </td>
                        </tr>
                        <tr>
                           <th>Age</th>
                           <td>
                              <div className="d-flex align-items-center justify-content-between">
                                 <p>{data?.age || "empty"}</p>
                                 <button onClick={() => openEditForm(data?.age)} className='bt9_change'>{openEdit === data?.age ? "Cancel" : "Edit"}</button>
                              </div>

                              <UpdateForm type={'number'}
                                 defaultValue={data?.age}
                                 actionLoading={actionLoading}
                                 getValue={setAge}
                                 updateDocHandler={updateDocHandler}
                                 openEdit={openEdit}
                              />
                           </td>
                        </tr>
                        <tr>
                           <th>Total Earn</th>
                           <td>
                              ${data?.total_earn}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyProfile;
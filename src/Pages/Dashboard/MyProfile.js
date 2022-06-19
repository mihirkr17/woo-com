import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from "../../Components/Shared/Spinner/Spinner";
import { useState } from 'react';

const MyProfile = () => {
   const [user] = useAuthState(auth);
   const [openEdit, setOpenEdit] = useState(false);

   const { data, loading, refetch } = useFetch(`https://woo-com-serve.herokuapp.com/my-profile/${user?.email}`);
   const [country, setCountry] = useState(data?.country);
   const [dob, setDob] = useState(data?.dob);
   const [age, setAge] = useState(data?.age);

   if (loading) return <Spinner></Spinner>;

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

      let dataModel = {
         country : country,
         dob : dob,
         age : age
      }

      const response = await fetch(`https://woo-com-serve.herokuapp.com/update-profile-data/${user?.email}`, {
         method: "PUT",
         headers: {
            "content-type": "application/json"
         },
         body: JSON.stringify(dataModel)
      });

      if (response.ok) {
         const d = await response.json();
         refetch();
      }
   }

   return (
      <div className='section_default'>
         <div className="container">

            <div className="profile_heder d-flex align-items-center justify-content-between py-3">
               <h5>My profile</h5>
               <button onClick={() => openEditForm(true)} className='btn btn-sm'>Edit</button>
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
                           <td>{data?.country || "empty"}
                              <form className={`${openEdit === true ? "d-block" : "d-none"}`} onSubmit={updateDocHandler}>
                                 <input type="text" name="" id="" defaultValue={data?.country} onChange={(e) => setCountry(e.target.value)} />
                                 <button type='submit'>Update</button>
                              </form>
                           </td>
                        </tr>
                        <tr>
                           <th>DOB</th>
                           <td>{data?.dob || "empty"}
                              <form className={`${openEdit === true ? "d-block" : "d-none"}`} onSubmit={updateDocHandler}>
                                 <input type="text" defaultValue={data?.dob} onChange={(e) => setDob(e.target.value)} />
                                 <button type='submit'>Update</button>
                              </form>
                           </td>
                        </tr>
                        <tr>
                           <th>Age</th>
                           <td>{data?.age || "empty"}
                              <form className={`${openEdit === true ? "d-block" : "d-none"}`} onSubmit={updateDocHandler}>
                                 <input type="text" defaultValue={data?.age} onChange={(e) => setAge(e.target.value)} />
                                 <button type='submit'>Update</button>
                              </form>
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
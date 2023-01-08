import React from 'react';
import { useFetch } from '../../../Hooks/useFetch';
import { useState } from 'react';
import UpdateForm from './Components/UpdateForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authLogout } from '../../../Shared/common';
import { useAuthContext } from '../../../lib/AuthProvider';
import SellerProfile from './SellerProfile/SellerProfile';


const MyProfile = () => {
   const { role, userInfo, authRefetch } = useAuthContext();
   const [openEdit, setOpenEdit] = useState(false);
   const [actionLoading, setActionLoading] = useState(false);
   const navigate = useNavigate();
   const queryParams = new URLSearchParams(window.location.search).get("update");
   const [inputValue, setInputValue] = useState({
      country: "",
      division: "",
      district: "",
      thana: "",
      dob: ""
   });

   let url2 = userInfo && userInfo?.seller?.storeInfos?.storeName ? `${process.env.REACT_APP_BASE_URL}api/product/product-count?seller=${userInfo?.seller?.storeInfos?.storeName}` :
      `${process.env.REACT_APP_BASE_URL}api/product/product-count`
   const { data: myProductCount } = useFetch(url2);

   let age = new Date().getFullYear() - (userInfo?.dob && parseInt((userInfo?.dob).split("-")[0]));

   useEffect(() => {
      if (queryParams === userInfo?._id) {
         setOpenEdit(true);
      } else {
         setOpenEdit(false);
      }
   }, [queryParams, userInfo?._id]);

   // common function for updating single value
   const updateDocHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      let data = {
         country: inputValue.country || "Not Set",
         division: inputValue.division || "Not Set",
         district: inputValue.district || "Not Set",
         thana: inputValue.thana || "Not Set",
         dob: inputValue.dob || "Not Set"
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/update-profile-data`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
            authorization: userInfo?.email
         },
         body: JSON.stringify(data)
      });

      const resData = await response.json();

      if (response.ok) {
         setActionLoading(false);
         authRefetch();
         // setInputValue({});
      } else {
         setActionLoading(false);
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      }
   }

   return (
      <div className='section_default my_profile'>
         <div className="container">

            <div className="row">
               {
                  role === 'SELLER' ? <SellerProfile userInfo={userInfo} role={role} myProductCount={myProductCount} /> : <div className="col-12">
                     <div className='tty_ssd'>
                        {openEdit ? "Edit Information" : "Personal Information"}
                        {
                           openEdit ? <button className='bt9_edit' onClick={() => navigate(`/dashboard/my-profile`)}>Cancel</button> :
                              <button className='bt9_edit' onClick={() => navigate(`/dashboard/my-profile?update=${userInfo?._id}`)}>Edit</button>
                        }
                     </div>


                     <div className="pb-3">
                        {
                           openEdit ? <UpdateForm inputValue={inputValue} setInputValue={setInputValue} userInfo={userInfo} actionLoading={actionLoading} updateDocHandler={updateDocHandler} /> :
                              <>
                                 <div className="profile_header">
                                    {
                                       (role === 'OWNER') && <div className='ph_i'>
                                          <span>Balance : {userInfo?.total_earn || 0}&nbsp;$</span>
                                          <button className='bt9_withdraw'>Withdraw</button>
                                       </div>
                                    }
                                 </div>
                                 <table className='table table-sm table-borderless'>
                                    <thead>
                                       <tr>
                                          <th></th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <th>ID</th>
                                          <td>{userInfo?._id}</td>
                                       </tr>
                                       <tr>
                                          <th>Email</th>
                                          <td>{userInfo?.email}</td>
                                       </tr>
                                       <tr>
                                          <th>Age</th>
                                          <td>{age || 0}</td>
                                       </tr>
                                       <tr>
                                          <th>Role</th>
                                          <td>{userInfo?.role}</td>
                                       </tr>
                                       <tr>
                                          <th>Country</th>
                                          <td>{userInfo?.country || "Not Set"}</td>
                                       </tr>
                                       <tr>
                                          <th>Division</th>
                                          <td>{userInfo?.division || "Not Set"}</td>
                                       </tr>
                                       <tr>
                                          <th>District</th>
                                          <td>{userInfo?.district || "Not Set"}</td>
                                       </tr>
                                       <tr>
                                          <th>Thana</th>
                                          <td>{userInfo?.thana || "Not Set"}</td>
                                       </tr>
                                       <tr>
                                          <th>DOB</th>
                                          <td>
                                             {userInfo?.dob || "Not Set"}
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </>

                        }
                     </div>

                  </div>
               }
            </div>
         </div>
      </div>
   );
};

export default MyProfile;
import React from 'react';
import { useFetch } from '../../../Hooks/useFetch';
import { useState } from 'react';
import "./MyProfile.css";
import UpdateForm from './Components/UpdateForm';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import useAuth from '../../../Hooks/useAuth';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useAuthUser } from '../../../App';


const MyProfile = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { role, userInfo, authLoading, authRefetch } = useAuth(user);
   const [openEdit, setOpenEdit] = useState(false);
   const [country, setCountry] = useState(userInfo?.country);
   const [dob, setDob] = useState(userInfo?.dob);
   const [actionLoading, setActionLoading] = useState(false);

   let url2 = userInfo && userInfo?.seller ? `${BASE_URL}api/product-count?seller=${userInfo?.seller}` :
      `${BASE_URL}api/product-count`
   const { data: myProductCount } = useFetch(url2);

   let age = new Date().getFullYear() - (userInfo?.dob && parseInt((userInfo?.dob).split("-")[0]));


   // open edit form
   const openEditForm = async (params) => {
      if (params === openEdit) {
         setOpenEdit(false);
      } else {
         setOpenEdit(params);
      }
   }

   const apiReq = async (data) => {
      const response = await fetch(`${BASE_URL}update-profile-data/${userInfo?.email}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
      });

      if (response.ok) {
         setActionLoading(false);
         await response.json();
         authRefetch();
      } else {
         setActionLoading(false);
      }
   }

   // common function for updating single value
   const updateDocHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);
      const updateFor = e.target.updateFor.value;
      let inputValues = {};

      if (updateFor === "country") {
         inputValues['country'] = country;
      }
      if (updateFor === "dob") {
         inputValues['dob'] = dob;
      }

      return await apiReq(inputValues);
   }

   if (authLoading) return <Spinner></Spinner>;
   return (
      <div className='section_default'>
         <div className="container">
            <h5>My profile</h5>
            <div className="profile_heder d-flex align-items-center justify-content-between flex-wrap py-3">
               <p>Balance : {userInfo?.total_earn || 0}&nbsp;$</p>
               {
                  (role === "owner" || role === "seller") && <div><button className='btn btn-info'>Withdraw</button></div>
               }
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
                           <td>
                              <div className="d-flex align-items-center justify-content-between">
                                 <p>{userInfo?.country || "empty"}</p>
                                 <button onClick={() => openEditForm("country")} className='bt9_change'>{openEdit === "country" ? "Cancel" : "Edit"}</button>
                              </div>
                              <UpdateForm type={'text'}
                                 defaultValue={userInfo?.country}
                                 actionLoading={actionLoading}
                                 getValue={setCountry}
                                 updateDocHandler={updateDocHandler}
                                 openEdit={openEdit}
                                 updateFor={"country"}
                              />
                           </td>
                        </tr>
                        <tr>
                           <th>DOB</th>
                           <td>
                              <div className="d-flex align-items-center justify-content-between">
                                 <p>{userInfo?.dob || "empty"}</p>
                                 <button onClick={() => openEditForm("dob")} className='bt9_change'>{openEdit === "dob" ? "Cancel" : "Edit"}</button>
                              </div>
                              <UpdateForm type={'date'}
                                 defaultValue={userInfo?.dob}
                                 actionLoading={actionLoading}
                                 getValue={setDob}
                                 updateDocHandler={updateDocHandler}
                                 openEdit={openEdit}
                                 updateFor={"dob"}
                              />
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               {
                  role === "seller" && <div className="col-12">
                     <div className="card">
                        <div className="card-body">
                           <h6>Seller Information :</h6>
                           <article>
                              <small>
                                 <strong>Display Name : </strong> {userInfo?.seller} <span className="text-muted">(Not change able)</span> <br />
                              </small>
                              <address>
                                 <small><strong>Village : </strong>{userInfo?.seller_address?.seller_village}</small><br />
                                 <small><strong>District : </strong>{userInfo?.seller_address?.seller_district}</small><br />
                                 <small><strong>Country : </strong>{userInfo?.seller_address?.seller_country}</small><br />
                                 <small><strong>Zip Code : </strong>{userInfo?.seller_address?.seller_zip}</small><br />
                                 <small><strong>Registered Phone : </strong>{userInfo?.seller_phone}</small> <br />
                              </address>
                              <small><strong>Total Product : </strong>{(myProductCount && myProductCount.count) || 0}</small><br />
                              <small><strong>Total Earn : </strong>{userInfo?.total_earn || 0}&nbsp;$</small><br />
                              <small><strong>Total Sold Product : </strong>{userInfo?.success_sell || 0}&nbsp;Items</small>
                           </article>
                        </div>
                     </div>
                  </div>
               }
            </div>
         </div>
      </div>
   );
};

export default MyProfile;
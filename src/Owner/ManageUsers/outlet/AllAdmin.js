import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { authLogout } from '../../../Shared/common';

const AllAdmin = () => {
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { data, loading, refetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/user/manage-user?uTyp=admin`);
   const navigate = useNavigate();
   if (loading) return <Spinner></Spinner>;

   const demoteToUserHandler = async (userId) => {
      if (window.confirm("Demote to user ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/api/user/demote-to-user/${userId}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            }
         });

         const resData = await response.json();

         if (response.ok) {
            refetch();
         } else {
            await authLogout();
            navigate(`/login?err=${resData?.error}`);
         }
      }
   }

   return (
      <div className='table-responsive pt-4'>
         {
            data && data.length > 0 ?
               <table className='table table-borderless table-striped table-sm'>
                  <thead className='table-dark'>
                     <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        data && data.map((usr, ind) => {
                           return (
                              <tr key={ind}>
                                 <td>{usr?.email}</td>
                                 <td>{usr?.role}</td>
                                 <td>
                                    <button className='btn btn-sm btn-warning' onClick={() => demoteToUserHandler(usr?._id)}>Demote To User</button>
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </table> : <p className='text-center py-2'><span>No Admin Found</span></p>
         }
      </div>
   );
};

export default AllAdmin;
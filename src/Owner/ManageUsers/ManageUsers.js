import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useAuthContext } from '../../lib/AuthProvider';
import { authLogout } from '../../Shared/common';
import "./ManageUsers.css";


const ManageUsers = () => {
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { role } = useAuthContext();
   const { data, loading, refetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/user/manage-user?uTyp=user`);
   const navigate = useNavigate();

   if (loading) return <Spinner></Spinner>;

   const makeAdminHandler = async (userId) => {
      if (window.confirm("Want to give permission 'admin'")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/make-admin/${userId}`, {
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
      <div className="user_section">

         <h5>Customers</h5>

         <div className='table-responsive pt-4'>
            {
               data && data.length > 0 ?
                  <table className='table table-striped table-sm'>
                     <thead className='table-dark'>
                        <tr>
                           <th>Name</th>
                           <th>Registered</th>
                           <th>Group</th>
                           {
                              role === "owner" &&
                              <th>Action</th>
                           }
                        </tr>
                     </thead>
                     <tbody>
                        {
                           data && data.map((usr, ind) => {
                              return (
                                 <tr key={ind}>
                                    <td>
                                       <h6>{usr.username}</h6>
                                       <span>{usr?.email}</span>
                                    </td>
                                    <td>
                                       <span>
                                          {usr?.createdAt}
                                       </span>
                                    </td>
                                    <td>{usr?.role}</td>

                                    {
                                       role === "owner" && <td>
                                          <button onClick={() => makeAdminHandler(usr?._id)} className="btn btn-sm btn-primary">
                                             Make Admin
                                          </button>
                                       </td>
                                    }

                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table> : <p className='text-center py-2'><span>No User Found</span></p>
            }
         </div>
      </div>
   );
};

export default ManageUsers;
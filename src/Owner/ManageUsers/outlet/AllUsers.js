import React from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useAuthContext } from '../../../lib/AuthProvider';
import { loggedOut } from '../../../Shared/common';


const AllUsers = () => {
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { role } = useAuthContext();
   const { data, loading, refetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/manage-user?uTyp=user`);
   const navigate = useNavigate();

   if (loading) return <Spinner></Spinner>;

   const makeAdminHandler = async (userId) => {
      if (window.confirm("Want to give permission 'admin'")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}make-admin/${userId}`, {
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
            await loggedOut();
            navigate(`/login?err=${resData?.message} token not found`);
         }
      }
   }

   return (
      <div>
         {
            data && data.length > 0 ?
               <Table striped responsive>
                  <thead>
                     <tr>
                        <th>Email</th>
                        <th>Role</th>
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
                                 <td><p style={{ cursor: "pointer" }}>{usr.email}</p></td>
                                 <td>{usr?.role}</td>
                                 <td>
                                    {
                                       role === "owner" && <button onClick={() => makeAdminHandler(usr?._id)} className="btn btn-sm btn-primary">
                                          Make Admin
                                       </button>
                                    }
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </Table> : <p className='text-center py-2'><span>No User Found</span></p>
         }
      </div>
   );
};

export default AllUsers;
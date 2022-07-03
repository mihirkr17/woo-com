import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';

const AllUsers = () => {
   const BASE_URL = useBASE_URL();
   const { data, loading, refetch } = useFetch(`${BASE_URL}api/manage-user?uTyp=user`);
   if (loading) return <Spinner></Spinner>;
   console.log(data)

   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');

   const makeAdminHandler = async (userId) => {
      if (window.confirm("Want to give permission 'admin'")) {
         const response = await fetch(`${BASE_URL}make-admin/${userId}`, {
            method : "PUT",
            headers: {
               "content-type": "application/json",
               authorization: `Bearer ${token}`
            }
      });
         if (await response.json()) refetch(); 
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
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        data && data.map((usr, ind) => {
                           return (
                              <tr key={ind}>
                                 <td><p style={{ cursor : "pointer" }}>{usr.email}</p></td>
                                 <td>{usr?.role}</td>
                                 <td>
                                    {
                                       usr?.role !== "admin" && <button onClick={() => makeAdminHandler(usr?._id)} className="btn btn-sm">
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
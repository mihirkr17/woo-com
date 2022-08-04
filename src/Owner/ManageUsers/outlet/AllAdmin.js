import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';


const AllAdmin = () => {
   const BASE_URL = useBASE_URL();
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { data, loading, refetch } = useFetch(`${BASE_URL}api/manage-user?uTyp=admin`);
   if (loading) return <Spinner></Spinner>;

   const demoteToUserHandler = async (userId) => {
      if (window.confirm("Demote to user ?")) {
         const response = await fetch(`${BASE_URL}api/demote-to-user/${userId}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
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
               </Table> : <p className='text-center py-2'><span>No Admin Found</span></p>
         }
      </div>
   );
};

export default AllAdmin;
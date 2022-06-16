import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from '../../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../../Hooks/useFetch';

const AllUsers = () => {
   const { data, loading, err, refetch } = useFetch(`https://woo-com-serve.herokuapp.com/all-users`);
   if (loading) return <Spinner></Spinner>;

   const makeAdminHandler = async (userId) => {
      if (window.confirm("Want to give permission 'admin'")) {
         const response = await fetch(`https://woo-com-serve.herokuapp.com/make-admin/${userId}`, {method : "PUT"});
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
                                 <td>{usr?.email}</td>
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
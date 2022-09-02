import React from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';


const AllSeller = () => {
   
   const { data, loading } = useFetch(`${process.env.REACT_APP_BASE_URL}api/user/manage-user?uTyp=seller`);
   if (loading) return <Spinner></Spinner>;
   return (
      <div className='table-responsive pt-4'>
         {
            data && data.length > 0 ?
               <table className='table table-striped table-sm table-borderless'>
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
                                 <td><p style={{ cursor: "pointer" }}>{usr.email}</p></td>
                                 <td>{usr?.role}</td>
                                 <td>

                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </table> : <p className='text-center py-2'><span>No User Found</span></p>
         }
      </div>
   );
};

export default AllSeller;
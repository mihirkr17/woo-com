import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';


const AllAdmin = () => {
   const { data, loading } = useFetch(`https://woo-com-serve.herokuapp.com/all-users`);
   if (loading) return <Spinner></Spinner>;
   const filterAdmin = data && data.filter(u => u?.role === "admin");
   return (
      <div>
         {
            filterAdmin && filterAdmin.length > 0 ?
               <Table striped responsive>
                  <thead>
                     <tr>
                        <th>Email</th>
                        <th>Role</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        filterAdmin && filterAdmin.map((usr, ind) => {
                           return (
                              <tr key={ind}>
                                 <td>{usr?.email}</td>
                                 <td>{usr?.role}</td>
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
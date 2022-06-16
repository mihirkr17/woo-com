import React from 'react';
import { Nav, Table } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';

const ManageUsers = () => {
   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <div className="d-flex align-items-center justify-content-center">
                     <Nav.Link as={NavLink} to='/dashboard/manage-users'>All Users</Nav.Link>
                     <Nav.Link as={NavLink} to='all-admin'>All Admin</Nav.Link>
                  </div>
               </div>
               <div className="col-12">
                  <Outlet></Outlet>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ManageUsers;
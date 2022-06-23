import React from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useAuthUser } from '../../lib/UserProvider';


const ManageUsers = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const navigate = useNavigate();

   // if role is not owner then redirect to dashboard
   useEffect(() => {
      if (role && role !== "owner") {
         navigate('/dashboard');
         return;
      };
   }, [navigate, role, user]);

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
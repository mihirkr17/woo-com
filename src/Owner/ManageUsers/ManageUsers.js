import { signOut } from 'firebase/auth';
import React from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.init';
import useAuth from '../../Hooks/useAuth';


const ManageUsers = () => {
   const [user] = useAuthState(auth);
   const { role } = useAuth(user);
   const navigate = useNavigate();

   useEffect(() => {
      if (role !== "" && role !== "owner") {
         signOut(auth);
         navigate('/');
         return;
      };
   }, [role, navigate]);

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
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.init';
import { signOut } from 'firebase/auth';
import useAuth from '../../Hooks/useAuth';
import { useEffect } from 'react';

const Dashboard = () => {
   const [user] = useAuthState(auth);
   const { role } = useAuth(user);
   const navigate = useNavigate();

   useEffect(() => {
      if ((role && (role !== "owner" && role !== "admin")) && !user) {
         signOut(auth);
         navigate('/');
         return;
      };
   }, [navigate, role, user]);

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-lg-3">
                  <button className='btn btn-sm btn-danger' onClick={() => signOut(auth) && navigate('/')}>Log Out</button>
                  <Nav.Link as={NavLink} to='/dashboard'>My profile</Nav.Link>
                  <Nav.Link as={NavLink} to='manage-orders'>Orders</Nav.Link>

                  {
                     (role === "owner") && <>
                        <Nav.Link as={NavLink} to='owner-data'>Owner</Nav.Link>
                        <Nav.Link as={NavLink} to='manage-users'>Manage Users</Nav.Link>
                     </>
                  }
               </div>
               <div className="col-lg-9">
                  <Outlet></Outlet>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
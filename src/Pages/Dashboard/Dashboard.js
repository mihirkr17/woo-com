import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.init';
import { signOut } from 'firebase/auth';
import useAuth from '../../Hooks/useAuth';
import { useEffect } from 'react';
import "./Dashboard.css";
import { useState } from 'react';

const Dashboard = () => {
   const [user] = useAuthState(auth);
   const { role } = useAuth(user);
   const navigate = useNavigate();
   const [responsive, setResponsive] = useState(window.innerWidth);

   useEffect(() => {
      if ((role && (role !== "owner" && role !== "admin")) && !user) {
         signOut(auth);
         navigate('/');
         return;
      };
   }, [navigate, role, user]);

   useEffect(() => {
      function reportWindowSize() {
         setResponsive(window.innerWidth);
      }
      // Trigger this function on resize
      window.addEventListener('resize', reportWindowSize);
      //  Cleanup for componentWillUnmount
      return () => window.removeEventListener('resize', reportWindowSize);
   }, []);

   return (
      <div className='section_default'>
         <div className="container">
            <div className={`${responsive < 567 ? "row" : "dashboard"}`}>
               <div className={`${responsive < 567 ? "col-12 pb-3" : "d_left"}`}>
                  <button className='btn btn-sm btn-danger' onClick={() => signOut(auth) && navigate('/')}>Log Out</button>
                  <div className="d_link">
                     <Nav.Link as={NavLink} to='/dashboard'>My profile</Nav.Link>
                     <Nav.Link as={NavLink} to='manage-orders'>Orders</Nav.Link>

                     {
                        (role === "owner") && <>
                           <Nav.Link as={NavLink} to='owner-data'>Owner</Nav.Link>
                           <Nav.Link as={NavLink} to='manage-users'>Manage Users</Nav.Link>
                        </>
                     }
                  </div>
               </div>
               <div className={`${responsive < 567 ? "col-12 pb-3" : "d_right"}`}>
                  <Outlet></Outlet>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
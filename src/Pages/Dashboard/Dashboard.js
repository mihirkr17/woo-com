import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useEffect } from 'react';
import "./Dashboard.css";
import { useState } from 'react';
import { useAuthUser, useSignOut } from '../../lib/UserProvider';

const Dashboard = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const [responsive, setResponsive] = useState(window.innerWidth);


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
                  <button className='btn btn-sm btn-danger' onClick={useSignOut}>Log Out</button>
                  <div className="d_link">
                     <Nav.Link as={NavLink} to='/dashboard'>My profile</Nav.Link>
                     <Nav.Link as={NavLink} to='manage-orders'>Orders</Nav.Link>

                     {
                        (role === "owner") && <>
                           <Nav.Link as={NavLink} to='owner-data'>Owner</Nav.Link>
                           <Nav.Link as={NavLink} to='manage-users'>Manage Users</Nav.Link>
                        </>
                     }
                     <Nav.Link as={NavLink} to='add-product'>Add Product</Nav.Link>
                     <Nav.Link as={NavLink} to='manage-product'>Manage Product</Nav.Link>
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
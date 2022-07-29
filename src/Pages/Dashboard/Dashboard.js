import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useEffect } from 'react';
import "./Dashboard.css";
import { useState } from 'react';
import { useAuthUser, useSignOut } from '../../lib/UserProvider';
import { useSellerChecker } from '../../lib/SellerCheckProvider';

const Dashboard = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const [responsive, setResponsive] = useState(window.innerWidth);
   const location = useLocation();
   const [act, setAct] = useState("");
   const { state } = useSellerChecker();

   useEffect(() => {
      const pathArr = location.pathname.split("/");
      const pathInfo = pathArr.slice(-1);

      if (pathArr.includes(pathInfo.toString())) {
         setAct(pathInfo.toString());
      }
   }, [location.pathname]);


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
               <div className={`${responsive < 567 ? "col-12 pb-3" : "d_left card_default card_description"}`}>
                  <button className='btn btn-sm btn-danger' onClick={useSignOut}>Log Out</button>
                  <div className="d_link">
                     <Nav.Link as={NavLink} className={act === "dashboard" ? "active_link" : ""} to='/dashboard'>Dashboard</Nav.Link>
                     <Nav.Link as={NavLink} className={act === "my-profile" ? "active_link" : ""} to='my-profile'>My Profile</Nav.Link>
                     {
                        role === "seller" &&
                        <Nav.Link as={NavLink} className={act === "add-product" ? "active_link" : ""} to='add-product'>Add Product</Nav.Link>
                     }
                     <Nav.Link as={NavLink} className={act === "manage-orders" ? "active_link" : ""} to='manage-orders'>Manage Orders</Nav.Link>
                     <Nav.Link as={NavLink} className={act === "manage-product" ? "active_link" : ""} to='manage-product'>Manage Product</Nav.Link>
                     {
                        (role === "owner") && <>
                           <Nav.Link as={NavLink} className={act === "owner-data" ? "active_link" : ""} to='owner-data'>Owner</Nav.Link>
                        </>
                     }
                     {
                        (role === "admin" || role === "owner") && <>
                           <Nav.Link as={NavLink} className={act === "manage-users" ? "active_link" : ""} to='manage-users'>Manage Users</Nav.Link>
                           <Nav.Link as={NavLink} className={act === "check-seller" ? "active_link" : ""} to='check-seller'>Check Seller {state?.slLength}</Nav.Link>
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
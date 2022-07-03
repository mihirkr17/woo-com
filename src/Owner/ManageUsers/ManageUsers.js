import React, { useState } from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useAuthUser } from '../../lib/UserProvider';
import "./ManageUsers.css";


const ManageUsers = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const navigate = useNavigate();
   const location = useLocation();
   const [act, setAct] = useState("");

   useEffect(() => {
      const pathArr = location.pathname.split("/");
      const pathInfo = pathArr.slice(-1);

      if (pathArr.includes(pathInfo.toString())) {
         setAct(pathInfo.toString());
      }
   }, [location.pathname]);

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
                  <div className="d-flex align-items-center justify-content-center manage_user_header">
                     <Nav.Link as={NavLink} className={act === "manage-users" ? "link_active" : ""} to='/dashboard/manage-users'>All Users</Nav.Link>
                     <Nav.Link as={NavLink} className={act === "all-admin" ? "link_active" : ""} to='all-admin'>All Admin</Nav.Link>
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
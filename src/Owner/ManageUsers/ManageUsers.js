import React, { useState } from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';
import "./ManageUsers.css";


const ManageUsers = () => {
   const { role } = useAuthContext();
   const location = useLocation();
   const [act, setAct] = useState("");

   useEffect(() => {
      const pathArr = location.pathname.split("/");
      const pathInfo = pathArr.slice(-1);

      if (pathArr.includes(pathInfo.toString())) {
         setAct(pathInfo.toString());
      }
   }, [location.pathname]);



   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <div className="d-flex align-items-center justify-content-center manage_user_header">
                     <Nav.Link as={NavLink} className={act === "manage-users" ? "link_active" : ""} to='/dashboard/manage-users'>All Users</Nav.Link>
                     {role === "owner" &&
                        <Nav.Link as={NavLink} className={act === "all-admin" ? "link_active" : ""} to='all-admin'>All Admin</Nav.Link>
                     }
                     <Nav.Link as={NavLink} className={act === "all-seller" ? "link_active" : ""} to='all-seller'>All Seller</Nav.Link>
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
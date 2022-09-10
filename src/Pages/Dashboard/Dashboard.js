import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { loggedOut } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBagShopping, faBlind, faCartFlatbed, faIndustry, faUserGroup } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
   const { role, userInfo } = useAuthContext();
   const [responsive, setResponsive] = useState(window.innerWidth);
   const location = useLocation();
   const [act, setAct] = useState("");
   const navigate = useNavigate();

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

   const handleToUser = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/switch-role/user`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            authorization: `userID ${userInfo?._id}`
         }
      });

      const resData = await response.json();

      if (response.ok) {
         window.location.href = `/`;
      } 
      
      if (response.status === 401 || response.status === 403) {
         await loggedOut();
         navigate(`/login?err=${resData?.error}`);
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <div className={`${responsive < 567 ? "row" : "dashboard"}`}>
               <div className={`${responsive < 567 ? "col-12 pb-3 d_right_side" : "d_left card_default card_description"}`}>
                  <div className="pp_iyg">
                     <button className='btn btn-sm btn-danger' onClick={async () => loggedOut()}>Log Out</button>
                     {
                        (userInfo?.isSeller && "seller") && <button className='btn btn-sm btn-primary mt-3' onClick={handleToUser}>Switch To User</button>
                     }
                  </div>
                  <div className="d_link">
                     <Nav.Link as={NavLink} className={act === "dashboard" ? "active_link" : ""} to='/dashboard'>
                        <FontAwesomeIcon icon={faIndustry} />
                        <span>&nbsp;&nbsp;Overview</span>
                     </Nav.Link>
                     <Nav.Link as={NavLink} className={act === "my-profile" ? "active_link" : ""} to='my-profile'>
                        <FontAwesomeIcon icon={faAddressCard} />
                        <span>&nbsp;&nbsp;Profile</span>
                     </Nav.Link>

                     <Nav.Link as={NavLink} className={act === "manage-product" ? "active_link" : ""} to='manage-product'>
                        <FontAwesomeIcon icon={faBagShopping} />
                        <span>&nbsp;&nbsp;Products</span>
                     </Nav.Link>
                     {
                        role === "seller" &&
                        <Nav.Link as={NavLink} className={act === "manage-orders" ? "active_link" : ""} to='manage-orders'>
                           <FontAwesomeIcon icon={faCartFlatbed} />
                           <span>&nbsp;&nbsp;Orders</span>
                        </Nav.Link>

                     }
                     {
                        (role === "admin" || role === "owner") && <>
                           <Nav.Link as={NavLink} className={act === "manage-users" ? "active_link" : ""} to='manage-users'>
                              <FontAwesomeIcon icon={faUserGroup} />
                              <span>&nbsp;&nbsp;Users</span>
                           </Nav.Link>
                           <Nav.Link as={NavLink} className={act === "privacy-policy" ? "active_link" : ""} to='privacy-policy'>
                              <FontAwesomeIcon icon={faBlind} />
                              <span>&nbsp;&nbsp;Privacy & Policy</span>
                           </Nav.Link>
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
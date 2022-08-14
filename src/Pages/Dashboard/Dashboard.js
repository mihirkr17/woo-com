import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSellerChecker } from '../../lib/SellerCheckProvider';
import { loggedOut } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';
import { useOrder } from '../../lib/OrderProvider';


const Dashboard = () => {
   const { role, userInfo } = useAuthContext();
   const [responsive, setResponsive] = useState(window.innerWidth);
   const location = useLocation();
   const [act, setAct] = useState("");
   const { state } = useSellerChecker();
   const { orderCount } = useOrder();
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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/switch-to-user/${userInfo?._id}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include"
      });

      const resData = await response.json();

      if (response.ok) {
         navigate(`/`);
         window.location.reload();
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
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
                     <Nav.Link as={NavLink} className={act === "dashboard" ? "active_link" : ""} to='/dashboard'>Dashboard</Nav.Link>
                     <Nav.Link as={NavLink} className={act === "my-profile" ? "active_link" : ""} to='my-profile'>My Profile</Nav.Link>

                     {
                        (role === "seller") &&
                        <>
                           <Nav.Link as={NavLink} className={act === "add-product" ? "active_link" : ""} to='add-product'>Add Product</Nav.Link>
                           <Nav.Link as={NavLink} className={act === "check-order" ? "active_link" : ""} to='check-order'>Check Order <span className="badge bg-danger">{orderCount}</span></Nav.Link>
                        </>
                     }
                     <Nav.Link as={NavLink} className={act === "manage-product" ? "active_link" : ""} to='manage-product'>Manage Product</Nav.Link>
                     {
                        (role === "owner") && <>
                           <Nav.Link as={NavLink} className={act === "owner-data" ? "active_link" : ""} to='owner-data'>Owner</Nav.Link>
                        </>
                     }
                     {
                        role === "admin" && <>
                           <Nav.Link as={NavLink} className={act === "check-seller" ? "active_link" : ""} to='check-seller'>Check Seller {state?.slLength}</Nav.Link>
                           <Nav.Link as={NavLink} className={act === "manage-orders" ? "active_link" : ""} to='manage-orders'>Manage Orders</Nav.Link>
                        </>
                     }
                     {
                        (role === "admin" || role === "owner") && <>
                           <Nav.Link as={NavLink} className={act === "manage-users" ? "active_link" : ""} to='manage-users'>Manage Users</Nav.Link>
                           <Nav.Link as={NavLink} className={act === "privacy-policy" ? "active_link" : ""} to='privacy-policy'>Privacy & Policy</Nav.Link>
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
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { authLogout } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlind, faBarsStaggered, faCartFlatbed, faIndustry, faUserGroup, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { useSellerChecker } from '../../lib/SellerCheckProvider';


const Dashboard = () => {
   const { role, userInfo } = useAuthContext();
   const [responsive, setResponsive] = useState(window.innerWidth);
   const { state } = useSellerChecker();
   const location = useLocation();
   const [act, setAct] = useState("");
   const [childLink, setChildLink] = useState();
   const [dropdown, setDropdown] = useState(false);

   const setAccordion = (params) => {
      if (childLink !== params) {
         setChildLink(params);
         return;
      }
      setChildLink(false);
   }

   const [shrink, setShrink] = useState(false);

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


         <div className={`db_container ${shrink ? 'isShrink' : ''}`}>

            {/* Left Bar */}
            <div className="db_left_bar">
               <div className="db_left_items">
                  <div className="pp_iyg">
                     <NavLink className="brand_logo" to="/">WooKart</NavLink>
                     <span>{role.toUpperCase()}</span>

                     {!shrink && <button className='bars' onClick={() => setShrink(true)}>
                        <FontAwesomeIcon icon={faBarsStaggered} />
                     </button>}
                  </div>
                  <div className="db_link">

                     <ul className='db_left_ul'>

                        <li className="link_group">
                           <NavLink className={act === "dashboard" ? "active_link" : ""} to='/dashboard'>
                              <FontAwesomeIcon icon={faIndustry} />
                              <span>&nbsp;&nbsp;Overview</span>
                           </NavLink>
                        </li>

                        <li className="link_group">

                           <button onClick={() => setAccordion('catalog')}>
                              <FontAwesomeIcon icon={faDatabase} />
                              <span>&nbsp;&nbsp;Catalog</span>
                           </button>

                           <div style={childLink === 'catalog' ? { display: 'block' } : { display: 'none' }}>
                              <NavLink className={act === "manage-product" ? "active_link" : ""} to='manage-product'>
                                 <span>&nbsp;&nbsp;Products</span>
                              </NavLink>
                              <NavLink className={act === "add-product" ? "active_link" : ""} to={`add-product`}>
                                 &nbsp;&nbsp;Add new product
                              </NavLink>
                           </div>
                        </li>

                        {
                           role === 'SELLER' &&
                           <li className="link_group">
                              <NavLink className={act === "manage-orders" ? "active_link" : ""} to='manage-orders'>
                                 <FontAwesomeIcon icon={faCartFlatbed} />
                                 <span>&nbsp;&nbsp;Orders</span>
                              </NavLink>

                           </li>
                        }

                        {
                           (role === 'ADMIN' || role === 'OWNER') &&
                           <>
                              <li className='link_group'>
                                 <button onClick={() => setAccordion('users')}>
                                    <FontAwesomeIcon icon={faUserGroup} />
                                    <span>&nbsp;&nbsp;Users</span>
                                 </button>

                                 <div style={childLink === 'users' ? { display: 'block' } : { display: 'none' }}>
                                    <NavLink className={act === "manage-users" ? "active_link" : ""} to='manage-users'>
                                       <span>&nbsp;&nbsp;Customers</span>
                                    </NavLink>
                                    <NavLink className={act === "manage-seller" ? "active_link" : ""} to='manage-seller'>
                                       <span>&nbsp;&nbsp;Sellers</span>
                                    </NavLink>
                                 </div>
                              </li>
                              <li className="link_group">
                                 <NavLink className={act === "privacy-policy" ? "active_link" : ""} to='privacy-policy'>
                                    <FontAwesomeIcon icon={faBlind} />
                                    <span>&nbsp;&nbsp;Privacy & Policy</span>
                                 </NavLink>
                              </li>
                           </>
                        }


                     </ul>

                  </div>
               </div>
            </div>

            {/* Right Bar */}
            <div className="db_right_bar">
               <div className="db_right_nav">
                  {shrink && <button className='bars bars_alt' onClick={() => setShrink(false)}>
                     <FontAwesomeIcon icon={faBarsStaggered} />
                  </button>}


                  {
                     (role === 'ADMIN' || role === 'OWNER') &&
                     <div className="notification">
                        <NavLink to='/dashboard/check-seller'>Seller Request ({state?.slLength})</NavLink>
                     </div>
                  }


                  <div className="db_dropdown_profile">
                     <button onClick={() => setDropdown(e => !e)}>
                        <strong>{userInfo?.seller?.storeInfos?.storeName}</strong>
                     </button>

                     <ul className="db_dropdown_profile_body" style={dropdown ? { display: 'block' } : { display: 'none' }}>

                        <li>
                           <NavLink className={act === "my-profile" ? "active_link" : ""} to='my-profile'>
                              Profile
                           </NavLink>
                        </li>

                        <li>
                           <button className='logout_btn' onClick={async () => authLogout()}>
                              Log Out
                           </button>
                        </li>

                     </ul>

                  </div>
               </div>

               <div className='db_right_content_wrapper' >
                  <Outlet></Outlet>
               </div>
            </div>

         </div>






      </div>
   );
};

export default Dashboard;
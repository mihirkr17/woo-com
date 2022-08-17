import { faCartShopping, faGauge, faHome, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthUser, useCart } from '../../App';
import { useAuthContext } from '../../lib/AuthProvider';
import { loggedOut } from '../../Shared/common';

const NavigationBar = ({ theme, setTheme }) => {
   const user = useAuthUser();
   const [openSearchField, setOpenSearchField] = useState(false);
   const [openAccount, setOpenAccount] = useState(false);
   const q = new URLSearchParams(window.location.search).get("q");
   const { role, userInfo } = useAuthContext();
   const { cartProductCount } = useCart();
   const navigate = useNavigate();

   const handleToSeller = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/switch-role/seller`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            authorization: `userID ${userInfo?._id}`
         }
      });

      const resData = await response.json();

      if (response.ok) {
         navigate(`/dashboard`);
         window.location.reload();
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      }
   }

   return (
      <Navbar sticky='top' className='navigation_bar' expand="lg">
         <Container className='nav_container'>
            <div className="nav_brand_logo">
               <Navbar.Brand className="nav_link" as={NavLink} to="/">Woo</Navbar.Brand>
            </div>

            <div className="nav_right_items">
               <div className='theme_box nv_items'>
                  <label className="switch">
                     <input type="checkbox" checked={theme ? true : ""} onChange={() => setTheme(!theme)} />
                     <span className="slider round"></span>
                  </label>
               </div>

               <div className="search_box nv_items">
                  <span onClick={() => setOpenSearchField(e => !e)}>
                     <FontAwesomeIcon icon={faSearch} />
                  </span>

                  <div className={`search_field ${openSearchField ? "active" : ""}`}>
                     <input type="search" className='form-control form-control-sm' onChange={(e) => navigate(`/search?q=${e.target.value}`)} defaultValue={q || ""} placeholder='Search product by title, brand, seller' name="s_query" />
                  </div>
               </div>

               <div className="nv_items">
                  <NavLink className="nav_link" to="/"><FontAwesomeIcon icon={faHome} /> </NavLink>
               </div>

               <div className="nv_items">
                  {
                     (((role === "owner") || (role === "admin") || (role === "seller")) && user) &&
                     <NavLink className="nav_link" to="/dashboard"><FontAwesomeIcon icon={faGauge}></FontAwesomeIcon></NavLink>
                  }
                  {
                     (role !== "owner" && role !== "admin" && role !== "seller") &&
                     <NavLink className="nav_link cart_link" to='/my-cart'><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                        {user && <div className="bg-info cart_badge">{cartProductCount || 0}</div>}
                     </NavLink>
                  }
               </div>

               {
                  (user && (role !== "owner" && role !== "admin" && role !== "seller")) &&
                  <div className="account_box nv_items">
                     <span onClick={() => setOpenAccount(e => !e)}>
                        <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>
                     </span>
                     <div className={`account_field ${openAccount ? "active" : ""}`}>
                        {
                           (userInfo?.isSeller && role === "user") &&
                           <button className='drp_item' onClick={handleToSeller}>Switch To Seller</button>
                        }
                        {!userInfo?.isSeller &&
                           <Link className="drp_item" to="/sell-online">Become a Seller</Link>}
                        <Link className='drp_item' to='/my-profile/my-order'>My Order</Link>
                        <Link className='drp_item' to='/my-profile/my-wishlist'>
                           My Wishlist ({(userInfo?.wishlist && userInfo?.wishlist.length) || 0})
                        </Link>
                        <button className='drp_item' onClick={async () => loggedOut()}>Logout</button>
                     </div>
                  </div>
               }

               {!user && <Link to="/login">Login</Link>}

            </div>
         </Container>
      </Navbar>
   );
};

export default NavigationBar;
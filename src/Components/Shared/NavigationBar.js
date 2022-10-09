import { faCartShopping, faGauge, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';
import { authLogout } from '../../Shared/common';
import SearchPage from '../../Pages/SearchPage/SearchPage';
import CategoryHeader from '../../Pages/Home/Components/CategoryHeader';

const NavigationBar = () => {
   const [openAccount, setOpenAccount] = useState(false);
   const { role, userInfo } = useAuthContext();
   const navigate = useNavigate();
   const [query, setQuery] = useState("");
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const location = useLocation();
   const path = location.pathname;

   const handleToSeller = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/switch-role/seller`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            authorization: `userID ${userInfo?._id}`
         }
      });

      const resData = await response.json();

      if (response.ok) {
         window.location.href = `/dashboard`;
      }

      if (response.status === 401 || response.status === 403) {
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      }
   }

   const handleSearch = async (e) => {
      try {
         e.preventDefault();
         if (query) {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/search-products/${query}`);
            const resData = await response.json();
            setData(resData);
            setLoading(false);
         } else {
            window.alert("Search by product name or category");
         }

      } catch (error) {
         setLoading(false)
      } finally {
         setLoading(false);
      }
   }

   const handleLogout = async () => {
      await authLogout();
   }

   return (
      <>
         <Navbar sticky='top' className='navigation_bar' expand="lg">
            <div className='container nav_container'>
               <div className="nav_brand_logo">
                  <Navbar.Brand className="nav_link brand_logo" as={NavLink} to="/">WooKart</Navbar.Brand>
               </div>

               <div className="nav_right_items">
                  {
                     (path !== '/register' && path !== '/login') && 
                  

                  <div className="search_box">

                     <form onSubmit={handleSearch} className='nv_items'>
                        <input type="search" className='form-control form-control-sm'
                           onChange={(e) => setQuery(e.target.value)} value={query}
                           placeholder='Search product by title, brand, seller' name="s_query" />
                        <button type='submit' className='btn btn-sm' style={{ border: "1px solid" }}><FontAwesomeIcon icon={faSearch} /></button>
                     </form>

                     {
                        query !== "" &&
                        <div className="search_result">
                           <SearchPage data={data} loading={loading} />
                        </div>
                     }
                  </div>
}

                  <div className="nv_items">
                     {
                        (((role === "owner") || (role === "admin") || (role === "seller"))) &&
                        <NavLink className="nav_link" to="/dashboard"><FontAwesomeIcon icon={faGauge}></FontAwesomeIcon></NavLink>
                     }
                     {
                        (role === 'user') &&
                        <NavLink className="nav_link cart_link" to='/my-cart'><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                           {<div className="bg-info cart_badge">{(userInfo?.myCartProduct && userInfo?.myCartProduct.length) || 0}</div>}
                        </NavLink>
                     }
                  </div>

                  {
                     ((role === 'user')) &&
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
                           <button className='drp_item' onClick={handleLogout}>Logout</button>
                        </div>
                     </div>
                  }

                  {!role && <Link to="/login">Login</Link>}

               </div>
            </div>
         </Navbar>

         {
            (path !== '/register' && path !== '/login') && <CategoryHeader />
         }
      </>

   );
};

export default NavigationBar;
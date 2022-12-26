import { faCartShopping, faGauge, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';
import { authLogout } from '../../Shared/common';
import SearchPage from '../../Pages/SearchPage/SearchPage';
import CategoryHeader from '../../Pages/Home/Components/CategoryHeader';

const NavigationBar = () => {
   const [openAccount, setOpenAccount] = useState(false);
   const { role, userInfo } = useAuthContext();
   const navigate = useNavigate();
   // const [query, setQuery] = useState("");
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const location = useLocation();
   const path = location.pathname;
   const [inFocus, setInFocus] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");

   if (role === 'owner' || role === 'admin' || role === 'seller') {
      return;
   }

   const cp = parseInt(new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('cart_p'));


   async function callApi(searchQuery) {
      try {

         if (searchQuery) {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/search-products/${searchQuery}`);
            const resData = await response.json();
            setData(resData);
            setLoading(false);
            setInFocus(true);
         }

      } catch (error) {
         setLoading(false)
      } finally {
         setLoading(false);
      }
   }


   function handleOnChange(e) {
      let { value } = e.target;
      setSearchQuery(value);
      callApi(value)
   }

   async function handleSearch(e) {
      try {

         e.preventDefault();
         setInFocus(true);
         await callApi(searchQuery);

      } catch (error) {
         setLoading(false)
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
                  <NavLink className="nav_link brand_logo" to="/">WooKart</NavLink>
                  {
                     (path !== '/register' && path !== '/login') &&

                     <div className="search_box">

                        <form className='search_form' onSubmit={handleSearch}>
                           <input type="search"
                              onChange={handleOnChange}
                              onFocus={() => setInFocus(true)}
                              onBlur={() => setInFocus(false)}
                              placeholder='Search for products, brands and more'
                              name="s_query"
                              value={searchQuery}
                           />
                           <button type='submit'>
                              <FontAwesomeIcon icon={faSearch} />
                           </button>

                           {
                              <div className={`search_result ${inFocus ? 'active' : ""}`}>
                                 <div className='card_default card_description'>
                                    {
                                       (data && data.length > 0) ? data.map((product, index) => {
                                          return (
                                             <div className="d-flex flex-row align-items-center justify-content-start mb-3" key={index}>
                                                <img src={product?.images && product?.images[0]} style={{ width: "25px", height: "25px", marginRight: "0.8rem", marginBottom: "0.4rem" }} alt="" />
                                                <Link to={`/c/${product?.categories && (product?.categories.join("/").toString())}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
                                             </div>
                                          )
                                       }) : <p>No Product Found...</p>
                                    }
                                 </div>

                              </div>
                           }
                        </form>



                     </div>
                  }
               </div>

               <div className="nav_right_items">
                  <div className="nv_items">
                     {
                        (((role === "owner") || (role === "admin") || (role === "seller"))) &&
                        <NavLink className="nav_link" to="/dashboard">Dashboard</NavLink>
                     }
                     {
                        (path !== '/register' && path !== '/login' && (role !== "seller") && (role !== "admin") && (role !== "owner")) &&
                        <NavLink className="nav_link cart_link" to='/my-cart'><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                           {<div className="bg-info cart_badge">{(cp) || 0}</div>}
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
                           <Link className="drp_item" to="/sell-online">Become a Seller</Link>
                           <Link className='drp_item' to='/my-profile/my-order'>My Order</Link>
                           <Link className='drp_item' to='/my-profile/my-wishlist'>
                              My Wishlist ({(userInfo?.wishlist && userInfo?.wishlist.length) || 0})
                           </Link>
                           <button className='drp_item' onClick={handleLogout}>Logout</button>
                        </div>
                     </div>
                  }

                  {!role && <Link className='nv_items nav_link' to="/login">Login</Link>}

               </div>

            </div>

            {
               (path !== '/register' && path !== '/login' && !path.startsWith('/dashboard')) && <CategoryHeader />
            }

         </Navbar>


      </>

   );
};

export default NavigationBar;
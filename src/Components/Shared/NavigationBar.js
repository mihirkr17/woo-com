import { faCartShopping, faClose, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';
import { authLogout } from '../../Shared/common';
import CategoryHeader from '../../Pages/Home/Components/CategoryHeader';

const NavigationBar = () => {
   const [openAccount, setOpenAccount] = useState(false);
   const { role, userInfo } = useAuthContext();
   const location = useLocation();
   const [data, setData] = useState([]);

   const path = location.pathname;
   const [searchQuery, setSearchQuery] = useState(null);

   useEffect(() => {
      const fetchData = setTimeout(() => {
         (async () => {
            if (searchQuery !== "" && searchQuery) {
               const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/search-products/${searchQuery}`);
               const resData = await response.json();
               setData(resData);
            }
         })();
      }, 100);

      return () => clearTimeout(fetchData);
   }, [searchQuery]);

   if (role === 'OWNER' || role === 'ADMIN' || role === 'SELLER') {
      return false;
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

                        <div className='search_form'>
                           <input type="search"
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder='Search for products, brands and more'
                              name="s_query"
                              value={searchQuery || ""}
                           />
                           <button onClick={() => setSearchQuery(null)}>
                              <FontAwesomeIcon icon={faClose} />
                           </button>

                           {(searchQuery) &&
                              <div className={`search_result active`}>
                                 <div className='card_default card_description'>
                                    {
                                       (data && data.length > 0) ? data.map((product, index) => {
                                          return (
                                             <div className="d-flex flex-row align-items-center justify-content-start mb-3" key={index}>
                                                <img src={product?.image && product?.image} style={{ width: "25px", height: "25px", marginRight: "0.8rem", marginBottom: "0.4rem" }} alt="" />
                                                <Link to={`/product/${product?.slug}?pId=${product._id}&vId=${product?._VID}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
                                             </div>
                                          )
                                       }) : <b>No Product Found...</b>
                                    }
                                 </div>

                              </div>
                           }
                        </div>



                     </div>
                  }
               </div>

               <div className="nav_right_items">
                  <div className="nv_items">
                     {
                        (((role === 'OWNER') || (role === 'ADMIN') || (role === 'SELLER'))) &&
                        <NavLink className="nav_link" to="/dashboard">Dashboard</NavLink>
                     }
                     {
                        (path !== '/register' && path !== '/login' && (role !== 'SELLER') && (role !== 'ADMIN') && (role !== 'OWNER')) &&
                        <NavLink className="nav_link cart_link" to='/my-cart'><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                           {<div className="bg-info cart_badge">{(userInfo?.buyer?.shoppingCartItems) || 0}</div>}
                        </NavLink>
                     }
                  </div>

                  {
                     ((role === 'BUYER')) &&
                     <div className="account_box nv_items">
                        <span onClick={() => setOpenAccount(e => !e)}>
                           <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>
                        </span>
                        <div className={`account_field ${openAccount ? "active" : ""}`}>
                           <Link className="drp_item" to="/sell-online">Become a Seller</Link>
                           <Link className="drp_item" to="/user/my-account">My Account</Link>
                           <Link className='drp_item' to='/user/my-account/orders-management'>My Order</Link>
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
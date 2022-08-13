import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ButtonGroup, Container, Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthUser, useCart } from '../../App';
import { useAuthContext } from '../../lib/AuthProvider';
import { loggedOut } from '../../Shared/common';
import "./NavigationBar.css";

const NavigationBar = ({ theme, setTheme }) => {
   const user = useAuthUser();
   const q = new URLSearchParams(window.location.search).get("q");
   const { role, userInfo } = useAuthContext();
   const { cartProductCount } = useCart();
   const navigate = useNavigate();

   const handleToSeller = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/switch-to-seller/${userInfo?._id}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include"
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
         <Container>
            <Navbar.Brand className="nav_link" as={NavLink} to="/">Woo-Com</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />


            <Navbar.Collapse id="basic-navbar-nav">
               <Nav.Item>
                  <input type="search" className='form-control form-control-sm' onChange={(e) => navigate(`/search?q=${e.target.value}`)} defaultValue={q || ""} placeholder='Search product by title, brand, seller' name="s_query" />
               </Nav.Item>



               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} className="nav_link" to="/">Home</Nav.Link>
                  {
                     (((role === "owner") || (role === "admin") || (role === "seller")) && user) &&
                     <Nav.Link as={NavLink} className="nav_link" to="/dashboard">dashboard</Nav.Link>
                  }
                  {
                     (role !== "owner" && role !== "admin" && role !== "seller") && <Nav.Link as={NavLink} className="nav_link cart_link" to='/my-cart'>Cart <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                        {user && <div className="bg-info cart_badge">{cartProductCount || 0}</div>}
                     </Nav.Link>
                  }

                  {
                     (user && (role !== "owner" && role !== "admin" && role !== "seller")) && <>
                        {!userInfo?.isSeller && <Nav.Link as={NavLink} className="nav_link" to="/sell-online">Become a Seller</Nav.Link>}

                        <DropdownButton
                           as={ButtonGroup}
                           align={{ lg: 'end' }}
                           title={user?.displayName}
                           id="dropdown-menu-align-responsive-1"
                        >
                           {(userInfo?.isSeller && role === "user") && <Dropdown.Item onClick={handleToSeller}>Switch To Seller</Dropdown.Item>}
                           <Dropdown.Item as={Link} to='/my-profile/my-order'>My Order</Dropdown.Item>
                           <div className='theme_box'>
                              <span>Theme</span>
                              <label className="switch">
                                 <input type="checkbox" checked={theme ? true : ""} onChange={() => setTheme(!theme)} />
                                 <span className="slider round"></span>
                              </label>
                           </div>
                           <button className='mt-2 btn btn-sm' onClick={async () => loggedOut()}>Logout</button>
                        </DropdownButton>
                     </>
                  }
                  {!user && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default NavigationBar;
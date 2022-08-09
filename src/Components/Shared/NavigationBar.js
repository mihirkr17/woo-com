import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthUser, useCart } from '../../App';
import useAuth from '../../Hooks/useAuth';
import { loggedOut } from '../../Shared/common';
import "./NavigationBar.css";

const NavigationBar = ({ theme, setTheme }) => {
   const user = useAuthUser();
   const q = new URLSearchParams(window.location.search).get("q");
   const { role, userInfo } = useAuth(user);
   const { cartProductCount } = useCart();
   const navigate = useNavigate();

   return (
      <Navbar sticky='top' className='navigation_bar' expand="lg">
         <Container>
            <Navbar.Brand className="nav_link" as={NavLink} to="/">Woo-Com</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />




            <Navbar.Collapse id="basic-navbar-nav">
               <Nav.Item>
                  <input type="search" className='form-control form-control-sm' onChange={(e) => navigate(`/search?q=${e.target.value}`)} defaultValue={q || ""} placeholder='Search product by title, brand, seller' name="s_query" />
               </Nav.Item>
               <Nav.Item>
                  <input type="checkbox" checked={theme ? true : ""} onChange={() => setTheme(!theme)} />
               </Nav.Item>
               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} className="nav_link" to="/">Home</Nav.Link>
                  {
                     (((role === "owner") || (role === "admin") || (role === "seller") || (userInfo?.isSeller)) && user) &&
                     <Nav.Link as={NavLink} className="nav_link" to="/dashboard">dashboard</Nav.Link>
                  }
                  {
                     (role !== "owner" && role !== "admin" && role !== "seller") && <Nav.Link as={NavLink} className="nav_link cart_link" to='/my-cart'>Cart <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                        {user && <div className="bg-info cart_badge">{cartProductCount}</div>}
                     </Nav.Link>
                  }

                  {
                     (user && (role !== "owner" && role !== "admin" && role !== "seller")) && <>
                        <Nav.Link as={NavLink} className="nav_link" to="/sell-online">Become a Seller</Nav.Link>

                        <Dropdown>
                           <Dropdown.Toggle className='btn-sm' variant="secondary" id="dropdown-basic">
                              {user?.displayName}
                           </Dropdown.Toggle>
                           <Dropdown.Menu>
                              <Dropdown.Item as={Link} to='/my-profile/my-order'>My Order</Dropdown.Item>
                              <Dropdown.Item as={Button} onClick={async () => loggedOut()}>Logout</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
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
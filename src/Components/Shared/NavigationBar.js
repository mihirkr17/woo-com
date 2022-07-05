import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useAuthUser, useSignOut } from '../../lib/UserProvider';
import "./NavigationBar.css";

const NavigationBar = ({ setQuery, cartProductCount }) => {
   const user = useAuthUser();
   const { role } = useAuth(user);

   return (
      <Navbar bg="light" sticky='top' expand="lg">
         <Container>
            <Navbar.Brand as={NavLink} to="/">Woo-Com</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav.Item><input type="search" className='form-control form-control-sm' placeholder='Search product' onChange={(e) => setQuery(e.target.value)} /></Nav.Item>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} className="nav_link" to="/">Home</Nav.Link>
                  {
                     (((role === "owner") || (role === "admin")) && user) &&
                     <Nav.Link as={NavLink} className="nav_link" to="/dashboard">dashboard</Nav.Link>
                  }{
                     (user && (role !== "owner" && role !== "admin")) && <>
                        <Nav.Link as={NavLink} className="nav_link cart_link" to='/my-cart'>Cart <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                           <div className="bg-info cart_badge">{cartProductCount}</div>
                        </Nav.Link>
                        <Dropdown>
                           <Dropdown.Toggle className='btn-sm' variant="secondary" id="dropdown-basic">
                              {user?.displayName}
                           </Dropdown.Toggle>
                           <Dropdown.Menu>
                              <Dropdown.Item as={Link} to='/my-profile/my-order'>My Order</Dropdown.Item>
                              <Dropdown.Item as={Button} onClick={useSignOut}>Logout</Dropdown.Item>
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
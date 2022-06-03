import { signOut } from 'firebase/auth';
import React from 'react';
import { Button, Container, Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../../firebase.init';

const NavigationBar = () => {
   const [user] = useAuthState(auth);
   return (
      <Navbar bg="light" expand="lg">
         <Container>
            <Navbar.Brand as={NavLink} to="/">Woo-Com</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                  {
                     !user ? <Nav.Link as={NavLink} to="/login">Login</Nav.Link> :
                        <>
                           <Nav.Link as={NavLink} to='/my-cart'>Cart</Nav.Link>
                           <Nav.Link as={NavLink} to='/dashboard/manage-orders'>Orders</Nav.Link>

                           <Dropdown>
                              <Dropdown.Toggle className='btn-sm' variant="secondary" id="dropdown-basic">
                                 {user?.displayName}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                 <Dropdown.Item as={Link} to='/my-profile/my-order'>My Order</Dropdown.Item>
                                 <Dropdown.Item as={Button} onClick={() => signOut(auth)}>Logout</Dropdown.Item>
                              </Dropdown.Menu>
                           </Dropdown>
                        </>
                  }
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default NavigationBar;
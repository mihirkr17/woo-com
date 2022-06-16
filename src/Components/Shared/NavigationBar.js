import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../../firebase.init';
import useAdmin from '../../Hooks/useAdmin';
import useOwner from '../../Hooks/useOwner';

const NavigationBar = ({ setQuery }) => {
   const [user] = useAuthState(auth);
   const [owner] = useOwner(user);
   const [admin] = useAdmin(user);

   return (
      <Navbar bg="light" expand="lg">
         <Container>
            <Navbar.Brand as={NavLink} to="/">Woo-Com</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav.Item><input type="search" placeholder='Search product' onChange={(e) => setQuery(e.target.value)} /></Nav.Item>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                  {
                     (owner || admin) && user ? <Nav.Link as={NavLink} to="/dashboard">dashboard</Nav.Link> :
                        user ? <>
                           <Nav.Link as={NavLink} to='/my-cart'>Cart <FontAwesomeIcon icon={faCartShopping} /> </Nav.Link>

                           <Dropdown>
                              <Dropdown.Toggle className='btn-sm' variant="secondary" id="dropdown-basic">
                                 {user?.displayName}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                 <Dropdown.Item as={Link} to='/my-profile/my-order'>My Order</Dropdown.Item>
                                 <Dropdown.Item as={Button} onClick={() => signOut(auth)}>Logout</Dropdown.Item>
                              </Dropdown.Menu>
                           </Dropdown>
                        </> : <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  }
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default NavigationBar;
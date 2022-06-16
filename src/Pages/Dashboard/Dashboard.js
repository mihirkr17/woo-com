import { signOut } from 'firebase/auth';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, Outlet } from 'react-router-dom';
import { auth } from '../../firebase.init';
import useOwner from '../../Hooks/useOwner';

const Dashboard = () => {
   const [user] = useAuthState(auth);
   const [owner, loading] = useOwner(user);

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-lg-3">
                  <button className='btn btn-sm btn-danger' onClick={() => signOut(auth)}>Log Out</button>
                  <Nav.Link as={NavLink} to='/dashboard'>My profile</Nav.Link>
                  <Nav.Link as={NavLink} to='manage-orders'>Orders</Nav.Link>

                  {
                     owner && <>
                        <Nav.Link as={NavLink} to='owner-data'>Owner</Nav.Link>
                        <Nav.Link as={NavLink} to='manage-users'>Manage Users</Nav.Link>
                     </>
                  }
               </div>
               <div className="col-lg-9">
                  <Outlet></Outlet>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';

const UserAccount = () => {

   const { userInfo } = useAuthContext();
   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-lg-2">
                  <div className="p-3">
                     <div className="py-2">
                        <span>Hello, {userInfo?.fullName}</span>
                     </div>
                     <ul>
                        <li>
                           <Link to='/user/my-account'>My Profile</Link>
                        </li>
                        <li>
                           <Link to='address-book'>My Address Book</Link>
                        </li>
                        <li>
                           <Link to='payment-management'>My Payment Option</Link>
                        </li>
                        <li>
                           <Link to="orders-management">My Orders</Link>
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="col-lg-10">
                  <div className="p-2 w-100 content_wrapper">
                     <Outlet></Outlet>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default UserAccount;
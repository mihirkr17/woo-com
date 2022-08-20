import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';
import "./ManageUsers.css";
import AllAdmin from './outlet/AllAdmin';
import AllSeller from './outlet/AllSeller';
import AllUsers from './outlet/AllUsers';


const ManageUsers = () => {
   const { role } = useAuthContext();
   const queryType = new URLSearchParams(window.location.search).get("userType");
   const navigate = useNavigate();

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <div className="d-flex align-items-center justify-content-center manage_user_header">
                     <button className={`tabs ${queryType === "all_users" ? "active" : ""}`} onClick={() => navigate('/dashboard/manage-users?userType=all_users')}>
                        Users
                     </button>
                     <button className={`tabs ${queryType === "all_seller" ? "active" : ""}`} onClick={() => navigate('/dashboard/manage-users?userType=all_seller')}>
                        Seller
                     </button>
                     {
                        (role === "owner") && <button className={`tabs ${queryType === "all_admin" ? "active" : ""}`} onClick={() => navigate('/dashboard/manage-users?userType=all_admin')}>
                           Admin
                        </button>
                     }
                  </div>
               </div>
               <div className="col-12">
                  {
                     (queryType === "all_admin" && role === "owner") && <AllAdmin />
                  }
                  {
                     (queryType === "all_seller" && (role === "owner" || role === "admin")) && <AllSeller />
                  }

                  {
                     ((queryType === "all_users" || !queryType) && (role === "owner" || role === "admin")) && <AllUsers />
                  }
                  
               </div>
            </div>
         </div>
      </div>
   );
};

export default ManageUsers;
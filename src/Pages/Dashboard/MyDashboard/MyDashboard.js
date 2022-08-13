import React from 'react';
import { useAuthContext } from '../../../lib/AuthProvider';

const MyDashboard = () => {
   const { userInfo } = useAuthContext();

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <p>{userInfo && userInfo?.email}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyDashboard;
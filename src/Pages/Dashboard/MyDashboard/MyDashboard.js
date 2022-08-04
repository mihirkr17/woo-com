import React from 'react';
import { useAuthUser } from '../../../App';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import useAuth from '../../../Hooks/useAuth';

const MyDashboard = () => {
   const user = useAuthUser();
   const {userInfo, authLoading} = useAuth(user);
   if (authLoading) return <Spinner></Spinner>;

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
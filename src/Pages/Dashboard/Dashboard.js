import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.init';
import { useOwner } from '../../Hooks/useOwner';

const Dashboard = () => {
   const [user] = useAuthState(auth);
   const {owner, loading} = useOwner(user?.email);
   console.log(owner);
   return (
      <div>
         {
            owner && <>
               <li>owner</li>
            </>
         }
         
      </div>
   );
};

export default Dashboard;
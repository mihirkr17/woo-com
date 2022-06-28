import React, { useEffect } from 'react';
import { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useFetch } from '../../../Hooks/useFetch';
import { useAuthUser } from '../../../lib/UserProvider';

const MyDashboard = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const [url, setUrl] = useState("");

   const {data, loading, refetch} = useFetch(url);

   useEffect(() => {
      if (role) {
         setUrl(
            role === "admin" ? `https://woo-com-serve.herokuapp.com/fetch-earning?email=${user?.email}` :
               `https://woo-com-serve.herokuapp.com/manage-orders`
         )
      }
   }, [role, user?.email]);
   return (
      <div className='section_default'>
         <div className="row">

         </div>
      </div>
   );
};

export default MyDashboard;
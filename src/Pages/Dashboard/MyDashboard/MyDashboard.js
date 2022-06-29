import React from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import { useAuthUser } from '../../../lib/UserProvider';

const MyDashboard = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();

   const { data, loading } = useFetch(`${BASE_URL}my-profile/${user?.email}`);
   if (loading) return <Spinner></Spinner>;

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12">
                  <p>{data && data?.email}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyDashboard;
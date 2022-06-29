import React from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useBASE_URL } from '../../lib/BaseUrlProvider';

const CheckOut = () => {
   const BASE_URL = useBASE_URL();
   const { orderId } = useParams();
   const {data, loading} = useFetch(`${BASE_URL}get-orderlist/${orderId}`);

   if (loading) {
      return <Spinner></Spinner>;
   }

   console.log(data);

   return (
      <div className='section_default'>
         <div className="container">
            {data?.user_email}
            {data?.orderId}
         </div>
      </div>
   );
};

export default CheckOut;
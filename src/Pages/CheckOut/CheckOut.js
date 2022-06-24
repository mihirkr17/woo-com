import React from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';

const CheckOut = () => {
   const { orderId } = useParams();
   const {data, refetch, loading} = useFetch(`https://woo-com-serve.herokuapp.com/get-orderlist/${orderId}`);

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
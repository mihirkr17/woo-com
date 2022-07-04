import React from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import { useAuthUser } from '../../lib/UserProvider';
import { cartCalculate } from '../../Shared/cartCalculate';

const CheckoutSingle = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { productId } = useParams();

   const { data, refetch, loading } = useFetch(`${BASE_URL}my-cart-item/${productId}/${user?.email}`);

   if (loading) return <Spinner></Spinner>

   const c = cartCalculate([data?.product]);
   console.log(c)

   return (
      <div>
         
      </div>
   );
};

export default CheckoutSingle;
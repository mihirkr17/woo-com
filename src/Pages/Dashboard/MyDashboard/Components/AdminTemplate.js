import React from 'react';
import { useFetch } from '../../../../Hooks/useFetch';

const AdminTemplate = () => {
   const {data} = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/dashboard-overview`);

   console.log(data)
   return (
      <div>
         
      </div>
   );
}; 

export default AdminTemplate;
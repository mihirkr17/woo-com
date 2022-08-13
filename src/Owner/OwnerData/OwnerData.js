import React from 'react';

import { useAuthContext } from '../../lib/AuthProvider';


const OwnerData = () => {
   const { role } = useAuthContext();

   return (
      <div>
         this is owner data {role}
      </div>
   );
};

export default OwnerData;
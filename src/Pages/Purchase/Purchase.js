import React from 'react';
import { useParams } from 'react-router-dom';

const Purchase = () => {
   const {productId} = useParams();
   return (
      <div>
            {productId}
      </div>
   );
};

export default Purchase;
import React from 'react';



const MakeSeller = () => {
   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');
   return (
      <div>
         this is seller page
      </div>
   );
};

export default MakeSeller;
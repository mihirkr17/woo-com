import React from 'react';

const BtnSpinner = () => {
   return (
      <div>
         <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
         <span class="visually-hidden">Loading...</span>
      </div>
   );
};

export default BtnSpinner;
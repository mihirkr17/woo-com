import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddSingleProduct = () => {
   const navigate = useNavigate();
   
   const vertical = new URLSearchParams(window.location.search).get("vertical");
   const brand = new URLSearchParams(window.location.search).get("brand");
   const requestId = new URLSearchParams(window.location.search).get("requestId");



   return (
      <div>
         <div className="row">
            This is single page
         </div>
      </div>
   );
};

export default AddSingleProduct;
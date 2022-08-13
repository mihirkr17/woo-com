import React from 'react';
import "./AddProduct.css";
import ProductTemplateForm from '../../../Shared/ProductTemplateForm';
import { useAuthContext } from '../../../lib/AuthProvider';

const AddProduct = () => {
   const { userInfo } = useAuthContext();

   return (
      <div className='section_default'>
         <div className="container">
            <h5 className='text-center pb-4'>Add Product</h5>
            <ProductTemplateForm userInfo={userInfo} formTypes={"create"} />
         </div>
      </div>
   );
};

export default AddProduct;
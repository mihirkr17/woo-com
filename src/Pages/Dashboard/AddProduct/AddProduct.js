import React from 'react';
import "./AddProduct.css";
import useAuth from '../../../Hooks/useAuth';
import ProductTemplateForm from '../../../Shared/ProductTemplateForm';
import { useAuthUser } from '../../../App';

const AddProduct = () => {
   const user = useAuthUser();
   const { userInfo } = useAuth(user);

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
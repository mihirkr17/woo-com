import React from 'react';
import "./AddProduct.css";
// import ProductTemplateForm from './Components/ProductTemplateForm';
import { useAuthContext } from '../../../lib/AuthProvider';
import { Link, useParams } from 'react-router-dom';
import ProductTemplateForm from '../ManageProduct/Components/ProductTemplateForm';

const AddProduct = () => {
   const { userInfo } = useAuthContext();
   const queryParams = new URLSearchParams(window.location.search).get("np");
   const querySeller = new URLSearchParams(window.location.search).get("s");


   return (
      <div className='section_default'>
         <div className="container">
            <h5 className='text-center pb-4'>Add Product</h5>

            <div className="row">
               <div className="col-lg-6">
                  <div className="card_default card_description">
                     <Link to={`/dashboard/add-product?np=add_product&s=${userInfo?.username}`}>Add Single Product</Link>
                  </div>
               </div>
            </div>

            {
               queryParams === 'add_product' && <ProductTemplateForm userInfo={userInfo} formTypes={"create"} />
            }
         </div>
      </div>
   );
};

export default AddProduct;
import React from 'react';
import "./AddProduct.css";
// import ProductTemplateForm from './Components/ProductTemplateForm';
import { useAuthContext } from '../../../lib/AuthProvider';
import { Link, useParams } from 'react-router-dom';
import ProductTemplateForm from '../GlobalComponents/ProductTemplateForm';
import { useMessage } from '../../../Hooks/useMessage';

const AddProduct = () => {
   const { userInfo } = useAuthContext();
   const queryParams = new URLSearchParams(window.location.search).get("np");
   const querySeller = new URLSearchParams(window.location.search).get("s");
   const { msg, setMessage } = useMessage();


   return (
      <div className='section_default'>
         <div className="container">
            {msg}

            {
               queryParams === 'add_product' ? <ProductTemplateForm userInfo={userInfo} setMessage={setMessage} formTypes={"create"} /> :
                  <>
                     <h5 className='text-center pb-4'>Add Product</h5>

                     <div className="row">
                        <div className="col-lg-6">
                           <div className="card_default card_description">
                              <Link to={`/dashboard/add-product?np=add_product&s=${userInfo?.seller?.storeInfos?.storeName}`}>Add Single Product</Link>
                           </div>
                        </div>
                     </div>
                  </>
            }
         </div>
      </div>
   );
};

export default AddProduct;
import React from 'react';
import { Interweave } from 'interweave';
import { textToTitleCase } from '../../../Shared/common';


const ProductAdditionalDetails = ({ product }) => {

   const specs = product?.specification;

   const body = product?.bodyInfo;


   function getSpecs(specs = {}) {
      let str = [];
      if (specs) {

         for (const [key, value] of Object.entries(specs)) {
            let pp = <li key={value + Math.round(Math.random() * 999)}><span>{textToTitleCase(key)}</span> <span>{value.split(",#")[0]}</span></li>
            str.push(pp);
         }
      }
      return str;
   }

   return (
      <div className="product-details row w-100">
         <div className='p_details col-lg-12'>
            <h5>Product details of {product?.title}</h5>
            <div className="product-details__items">
               <ul>
                  {
                     getSpecs(product?.variations?.variant)
                  }
                  {
                     getSpecs(specs)
                  }
               </ul>
            </div>
         </div>

         {
            body?.description && <div className="p_details col-lg-12">
               <h5>Product description of {product?.title}</h5>
               <article>

                  <Interweave content={body?.description} />

               </article>
            </div>
         }


      </div>
   );
};

export default ProductAdditionalDetails;
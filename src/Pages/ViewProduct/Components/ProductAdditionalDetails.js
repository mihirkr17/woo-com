import React from 'react';
import { Interweave } from 'interweave';

const ProductAdditionalDetails = ({ product }) => {

   const specs = product?.specification;

   const body = product?.bodyInfo;


   function getSpecs(specs = {}) {
      let str = [];
      if (specs) {

         for (const [key, value] of Object.entries(specs)) {
            let pp = <li style={{ fontSize: "0.8rem" }} key={value + Math.round(Math.random() * 999)}><span>{key.replace(/_+/gi, " ").toUpperCase()}</span> <span>{value.split(",#")[0]}</span></li>
            str.push(pp);
         }
      }
      return str;
   }

   return (
      <div className="product-details row w-100">
         <div className='p_details col-lg-12'>
            <h5>Product Details</h5>
            <ul className="product-details__items">
               {
                  getSpecs(product?.variations?.variant)
               }
               {
                  getSpecs(specs)
               }
            </ul>
         </div>

         {
            body?.description && <div className="p_details col-lg-12">
               <h5>Product Description</h5>
               <article>

                  <Interweave content={body?.description} />

               </article>
            </div>
         }


      </div>
   );
};

export default ProductAdditionalDetails;
import React from 'react';
import { Interweave } from 'interweave';

const ProductAdditionalDetails = ({ product }) => {

   const attr = product?.variations?.attributes;

   const body = product?.bodyInfo;

   return (
      <div className="product-details row">
         <div className='p_details col-lg-12'>
            <h5>Product Details</h5>
            <ul className="product-details__items">
               {attr?.pType && <li><span>Type</span> <span>{attr?.pType}</span></li>}
               {attr?.size && <li><span>Size</span> <span>{attr?.size}</span></li>}
               {attr?.color && <li><span>Color</span> <span>{attr?.color}</span></li>}
               {attr?.fabric && <li><span>Fabric</span> <span>{attr?.fabric}</span></li>}
               {attr?.pattern && <li><span>Pattern</span> <span>{attr?.pattern}</span></li>}
               {attr?.idealFor && <li><span>Ideal</span> <span>{attr?.idealFor}</span></li>}
               {attr?.sleeve && <li><span>Sleeve</span> <span>{attr?.sleeve}</span></li>}
               {attr?.fabricCare && <li><span>Fabric Care</span> <span>{attr?.fabricCare}</span></li>}
               {attr?.fit && <li><span>Fit</span> <span>{attr?.fit}</span></li>}
               {attr?.suiteFor && <li><span>Suite For</span> <span>{attr?.suiteFor}</span></li>}
               {attr?.sportType && <li><span>Sport Type</span> <span>{attr?.sportType}</span></li>}
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DropDown = ({ mProduct, location, productControlHandler, openDropDown, setUpdateProductForm, setOpenProductVariationModal }) => {


   return (

      <ul className="dropdown-menu" style={openDropDown?._LID === mProduct?._LID ? { display: 'block', right: 0 } : { display: 'none' }}>
         <li>
            <Link className='dropdown-item' state={{ from: location }} replace
               to={`/dashboard/manage-product?np=edit_product&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
               Edit Product
            </Link>
         </li>
         <li>
            <button className="status_btn_alt dropdown-item" onClick={() => setUpdateProductForm(mProduct && mProduct)}>
               Edit Product
            </button>

         </li>
         <li>
            <button className="status_btn_alt dropdown-item" onClick={() => setOpenProductVariationModal(mProduct && {
               _id: mProduct?._id,
               formType: "new-variation",
               title: mProduct?.title,
               categories: mProduct?.categories,
               listingID: mProduct?._LID,
            })}>
               Add New Variation
            </button>
         </li>
         <li>
            {
               mProduct?.save_as === 'fulfilled' &&
               <button className='dropdown-item text-danger'
                  onClick={() => productControlHandler("draft", mProduct?._LID, mProduct?._id)}
               >
                  Move To Draft
               </button>
            }
         </li>
      </ul>
   );
};

export default DropDown;
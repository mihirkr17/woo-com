import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newCategory } from '../../../../Assets/CustomData/categories';
import ProductAttributes from '../../ManageProduct/Components/ProductAttributes';
import ProductListing from '../../ManageProduct/Components/ProductListing';
import ProductVariations from '../../ManageProduct/Components/ProductVariations';
import VariationFormThree from '../../ManageProduct/Components/VariationFormThree';



const ProductTemplate = ({ formTypes, data, refetch }) => {
   const [toggle, setToggle] = useState(null);
   const location = useLocation();
   const from = location?.state?.from?.pathname;
   const navigate = useNavigate();
   let super_category;

   const required = <span style={{ color: "red" }}>*</span>;

   // this is global variable of categories states
   if (data) {
      let fc = data?.categories && data?.categories[0];
      let sc = data?.categories && data?.categories[1];
      let tc = data?.categories && data?.categories[2];

      const sub_category = newCategory && newCategory.find(e => e.category === fc);
      const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === sc);
      super_category = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === tc);
   }

   const handleToggle = (params) => {
      if (params !== toggle) {
         setToggle(params);
         return;
      }
      setToggle(null);
   }

   const goThere = () => {
      navigate(from, { replace: true });
   }

   return (
      <>
         <button className='btn' onClick={() => goThere()}>
            Back
         </button>

         <div className="card_default card_description">
            <div className="d-flex align-items-start justify-content-between pb-3">
               <h5>Product Intro</h5>
               <button className='bt9_edit' onClick={() => handleToggle('productIntro')}>
                  {toggle === 'productIntro' ? 'Cancel' : 'Edit'}
               </button>
            </div>

            {toggle === 'productIntro' ?
               <ProductListing required={required} formTypes={formTypes} data={data} refetch={refetch} />
               : <div className='row py-2'>
                  <div className="col-lg-6"><small>CATEGORIES : {data?.categories && data?.categories.join("-->")}</small></div>
                  <div className="col-lg-6"><small>SELLER : {data?.seller?.name}</small></div>
                  <div className="col-lg-6"><small>BRAND : {data?.brand}</small></div>
                  <div className="col-lg-6"><small>SAVE AS : {data?.save_as}</small></div>
               </div>
            }
         </div>


         <br />

         {
            (formTypes === 'update-variation' || formTypes === 'new-variation') && <div className="card_default card_description">
               <div className="d-flex align-items-start justify-content-between pb-3">
                  <h5>Product Variations And Shipping Information (24)</h5>
                  <button className='bt9_edit' onClick={() => handleToggle('variationOne')}>
                     {toggle === 'variationOne' ? 'Cancel' : 'Edit'}
                  </button>
               </div>

               {toggle === 'variationOne' ?
                  <ProductVariations required={required} formTypes={formTypes} data={data} refetch={refetch} super_category={super_category} />
                  : <div className='row py-2'>
                     <div className="col-lg-6"><small>SKU : {data?.variations?.sku || "empty"}</small></div>
                     <div className="col-lg-6"><small>STATUS : {data?.variations?.status || "empty"}</small></div>
                     <div className="col-lg-6"><small>BDT : {data?.variations?.pricing?.price || "empty"}</small></div>
                     <div className="col-lg-6"><small>SELLING PRICE : {data?.variations?.sellingPrice || "empty"}</small></div>
                  </div>
               }
            </div>
         }

         <br />

         {
            formTypes === 'update' &&
            <>
               <div className="card_default card_description">
                  <div className="d-flex align-items-start justify-content-between pb-3">
                     <h5>Product Description</h5>
                     <button className='bt9_edit' onClick={() => handleToggle('variationTwo')}>
                        {toggle === 'variationTwo' ? 'Cancel' : 'Edit'}
                     </button>
                  </div>

                  {
                     toggle === 'variationTwo' ?
                        <ProductAttributes required={required} formTypes={formTypes} data={data} refetch={refetch} super_category={super_category} />
                        : <div className='row py-2'>
                           <div className="col-lg-6"><small>TYPE : {data?.attributes?.pType}</small></div>
                           <div className="col-lg-6"><small>SIZE : {data?.variations?.size}</small></div>
                           <div className="col-lg-6"><small>COLOR : {data?.variations?.color}</small></div>
                           <div className="col-lg-6"><small>PATTERN : {data?.attributes?.pattern}</small></div>
                        </div>
                  }
               </div>

               <br />

               <div className="card_default card_description">
                  <div className="d-flex align-items-start justify-content-between pb-3">
                     <h5>Additional Description</h5>
                     <button className='bt9_edit' onClick={() => handleToggle('variationThree')}>
                        {toggle === 'variationThree' ? 'Cancel' : 'Edit'}
                     </button>
                  </div>

                  {
                     toggle === 'variationThree' ?
                        <VariationFormThree required={required} formTypes={formTypes} data={data} refetch={refetch} />
                        : <div className='row py-2'>
                           <div className="col-lg-6"><small>MODEL NAME : {data?.variations?.attributes?.pType}</small></div>
                           <div className="col-lg-6"><small>EAN/UPC : {data?.variations?.attributes?.size}</small></div>
                        </div>
                  }
               </div>
            </>
         }
      </>
   );
};

export default ProductTemplate;
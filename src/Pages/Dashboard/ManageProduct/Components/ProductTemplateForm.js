import React from 'react';
import ProductListing from './ProductListing';
import ProductVariations from './ProductVariations';
import ProductSpecification from './ProductSpecification';
import BodyInformation from './BodyInformation';
import { newCategory } from '../../../../Assets/CustomData/categories';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const ProductTemplateForm = ({ formTypes, data, refetch }) => {
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

   function getAttrs(obj = {}) {

      let str = [];

      for (const [key, value] of Object.entries(obj)) {
         str.push(
            <div className="col-lg-6"><small>{key.replace("_", " ").toUpperCase()} : {value}</small></div>
         )
      }

      return str.slice(0, 6);
   }

   return (
      <>
         <button className='btn' onClick={() => goThere()}>
            Back
         </button>

         <div className="card_default card_description">
            <div className="d-flex align-items-start justify-content-between pb-3">
               <h5>Product Intro</h5>
               {

                  formTypes !== 'update-variation' &&

                  <button className='bt9_edit' onClick={() => handleToggle('productIntro')}>
                     {toggle === 'productIntro' ? 'Cancel' : 'Edit'}
                  </button>
               }
            </div>

            {toggle === 'productIntro' ?
               <ProductListing required={required} formTypes={formTypes} data={data} refetch={refetch} />
               : <div className='row py-2'>
                  <div className="col-lg-6"><small>CATEGORIES : {data?.categories && data?.categories.join("-->")}</small></div>
                  <div className="col-lg-6"><small>SELLER : {data?.seller?.name}</small></div>
                  <div className="col-lg-6"><small>BRAND : {data?.brand}</small></div>
                  <div className="col-lg-6"><small>SAVE AS : {data?.save_as}</small></div>
                  <div className="col-lg-6"><small>Product Title : {data?.title}</small></div>
               </div>
            }
         </div>

         <br />

         {
            (formTypes === 'update-variation' || formTypes === 'new-variation') && <div className="card_default card_description">
               <div className="d-flex align-items-start justify-content-between pb-3">
                  <h5>
                     {
                        formTypes === 'update-variation' ? "Update Product Variation" : "Create Product Variation"
                     }
                  </h5>

                  {
                     formTypes === 'update-variation' ? <button className='bt9_edit' onClick={() => handleToggle('productVariation')}>
                        {toggle === 'productVariation' ? 'Cancel' : 'Edit'}
                     </button> : <button className='bt9_edit' onClick={() => handleToggle('productVariation')}>
                        {toggle === 'productVariation' ? 'Cancel' : 'Create Variation'}
                     </button>
                  }
               </div>

               {toggle === 'productVariation' ?
                  <ProductVariations required={required} formTypes={formTypes} data={data} refetch={refetch} super_category={super_category} />
                  : <div className='row py-2'>
                     {
                        formTypes === 'update-variation' && getAttrs(data?.variations?.variant)
                     }
                     {
                        formTypes === 'update-variation' && getAttrs(data?.variations?.pricing)
                     }

                     {
                        formTypes === 'new-variation' && <button className='bt9_edit py-3' onClick={() => handleToggle('productVariation')}>
                           {toggle === 'productVariation' ? 'Cancel' : 'Add New Variation'}
                        </button>
                     }

                  </div>
               }
            </div>
         }

         <br />

         {
            formTypes === 'update' &&
            <>
               {
                  super_category?.specification &&
                  <div className="card_default card_description">
                     <div className="d-flex align-items-start justify-content-between pb-3">
                        <h5>Product Specification</h5>
                        <button className='bt9_edit' onClick={() => handleToggle('variationTwo')}>
                           {toggle === 'variationTwo' ? 'Cancel' : 'Edit'}
                        </button>
                     </div>

                     {
                        toggle === 'variationTwo' ?
                           <ProductSpecification required={required} formTypes={formTypes} data={data} refetch={refetch} super_category={super_category} />
                           : <div className='row py-2'>
                              {
                                 data?.attributes ? getAttrs(data?.attributes) : <p>No attributes present here</p>
                              }
                           </div>
                     }
                  </div>
               }

               <br />

               <div className="card_default card_description">
                  <div className="d-flex align-items-start justify-content-between pb-3">
                     <h5>Additional Description</h5>
                     <button className='bt9_edit' onClick={() => handleToggle('bodyInformation')}>
                        {toggle === 'bodyInformation' ? 'Cancel' : 'Edit'}
                     </button>
                  </div>

                  {
                     toggle === 'bodyInformation' ?
                        <BodyInformation required={required} formTypes={formTypes} data={data} refetch={refetch} super_category={super_category} />
                        : <div className='row py-2'>
                           <div className="col-lg-6"><small>Meta Information: {data?.bodyInfo?.metaDescription.slice(0, 20) + "..."}</small></div>

                           {
                              data?.bodyInfo?.searchKeywords &&
                              <div className="col-lg-6"><small>Search Keywords : {data?.bodyInfo?.searchKeywords.join(", ")}</small></div>
                           }
                           {
                              data?.bodyInfo?.keyFeatures &&
                              <div className="col-lg-6"><small>Key Features : {data?.bodyInfo?.keyFeatures.join(", ")}</small></div>
                           }

                        </div>
                  }
               </div>
            </>
         }
      </>
   );
};

export default ProductTemplateForm;
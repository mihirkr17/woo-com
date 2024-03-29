import React from 'react';
import { useState } from 'react';
import { useBaseContext } from '../../../lib/BaseProvider';


const ProductVariations = ({ required, data, formTypes, super_category, userInfo, refetch }) => {

   const variation = data?.variations && data?.variations;

   const { setMessage } = useBaseContext();

   const [variant, setVariant] = useState(variation?.variant || {});

   const [attrs, setAttrs] = useState(variation?.attrs || {});


   async function handleVariationOne(e) {
      try {
         e.preventDefault();
         // setActionLoading(true);

         let sku = e.target.sku.value;
         let status = e.target.status.value;
         let available = e.target.available.value;
         let priceModifier = e.target.priceModifier.value;
         let variationID = variation?._VID ? variation?._VID : "";
         let vTitle = data?.title && data?.title;

         vTitle = vTitle + (variant?.ram ? (" " + (variant?.ram)) : "") +
            (variant?.rom ? (" " + (variant?.rom)) : "") +
            (variant?.color ? (" " + variant?.color.split(",")[0]) : "");
         vTitle = vTitle.trim();

         let model = {
            pageURL: '/dashboard/manage-product?np=update-variation&store=' + userInfo?.seller?.storeInfos?.storeName + "&pid=" + data?._id && data?._id,
            productID: data?._id && data?._id,
            variationID,
            variations: {
               vTitle,
               sku,
               variant,
               attrs,
               status,
               available,
               priceModifier
            }
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/seller/products/set-product-variation?formType=${formTypes}&vId=${variation?._VID || ""}&requestFor=product_variations`, {
            withCredentials: true,
            credentials: 'include',
            method: 'PUT',
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id && data?._id
            },
            body: JSON.stringify({ request: model })
         });

         const { message } = await response.json();

         if (response.ok) {
            setMessage(message, 'success');
            refetch();
            return;
         }

         setMessage(message, 'danger');


      } catch (error) {
         setMessage(error?.message, 'danger')
      }
   }

   function cSl(obj = {}, existObj = {}, params) {

      let attObject = Object.entries(obj);

      let str = [];

      for (let [key, value] of attObject) {

         str.push(
            (Array.isArray(value) && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{key.replace(/_+/gi, " ").toUpperCase()}</label>

               <select
                  name={key}
                  id={key}
                  className='form-select form-select-sm'
                  onChange={(e) => (params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) : setAttrs({ ...attrs, [e.target.name]: e.target.value }))}>
                  {
                     Object.keys(existObj).includes(key) && <option value={existObj[key]}>{existObj[key]}</option>
                  }

                  <option value="">Select {key.replace("_", " ")}</option>
                  {
                     value && value.map((val, i) => {
                        return (<option key={i.toString() + key + params} value={val}>{val}</option>)
                     })
                  }
               </select>
            </div>

            ), typeof value !== 'object' && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required} {key.replace(/_+/gi, " ").toUpperCase()}</label>
               <input
                  type="text"
                  name={key}
                  id={key}
                  placeholder={"Write " + key}
                  onChange={(e) => (params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) : setAttrs({ ...attrs, [e.target.name]: e.target.value }))}
                  defaultValue={Object.keys(existObj).includes(key) ? existObj[key] : ""}
                  className='form-control form-control-sm'
               />
            </div>

         )
      }

      return str;
   }


   return (

      <div className="p-3">
         {
            formTypes === "new-variation" ? <h6>Add New Variation</h6> : <h6>Variation Information</h6>
         }

         <small>
            <b>Product ID: {data?._id}</b> <br />
            {
               variation?._VID &&
               <b>Variation ID: {variation?._VID}</b>
            }
         </small>
         <form onSubmit={handleVariationOne}>
            {/* Price Stock And Shipping Information */}
            <div className="row my-4">

               {/* SKU */}
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='sku'>{required} SKU <small>(Stock Keeping Unit)</small></label>
                  <input className='form-control form-control-sm' name='sku' id='sku' type='text' defaultValue={variation?.sku || ""} />
               </div>

               <div className="col-lg-12 my-2">
                  <b>Status Details</b>
                  <div className="row">
                     <div className="col-lg-3 mb-3">
                        <label htmlFor="status">{required} Product Status</label>
                        <select className='form-select form-select-sm' name="status" id="status">
                           <option value={variation?.status || ""}>{variation?.status || "Select Status"}</option>
                           <option value="active">Active</option>
                           <option value="inactive">Inactive</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Price Details */}
               <div className="col-lg-12 my-2">
                  <b>Stock Details</b>
                  <div className="row">

                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='priceModifier'>{required} Price Modifier</label>
                        <input className='form-control form-control-sm' name='priceModifier' id='priceModifier' type='number'
                           defaultValue={variation?.priceModifier} />
                     </div>

                     {/* Stock */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='available'>{required} Stock</label>
                        <input className='form-control form-control-sm' name='available' id='available' type='number'
                           defaultValue={variation?.available} />
                     </div>
                  </div>
               </div>

               {
                  cSl(super_category?.variant, variation?.variant, "variant")
               }

               <br />
               <p>Attrs</p>

               {
                  cSl(super_category?.attrs, variation?.attrs, "attrs")
               }

            </div>

            <div className="col-lg-12 my-2 pt-4">

               <button type='submit' className='bt9_edit'>Save Changes</button>
            </div>
         </form>
      </div>
   )
}

export default ProductVariations;
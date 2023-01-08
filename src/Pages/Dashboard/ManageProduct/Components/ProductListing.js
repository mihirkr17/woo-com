import React, { useState } from 'react';
import { authLogout, slugMaker } from '../../../../Shared/common';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useMessage } from '../../../../Hooks/useMessage';
import { newCategory } from '../../../../Assets/CustomData/categories';
import { paymentMode } from '../../../../Assets/CustomData/paymentMode';

const ProductListing = ({ required, userInfo, formTypes, data, refetch }) => {

   const [slug, setSlug] = useState(data?.slug || "");

   const [actionLoading, setActionLoading] = useState(false);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();
   // Category states
   const [category, setCategory] = useState((data?.categories && data?.categories[0]) || '');
   const [subCategory, setSubCategory] = useState((data?.categories && data?.categories[1]) || '');
   const [postCategory, setPostCategory] = useState((data?.categories && data?.categories[2]) || '');

   const [paymentInfo, setPaymentInfo] = useState({ payment_info: data?.paymentInfo || [] });


   const [warrantyType, setWarrantyType] = useState(data?.warranty?.wType || "");
   const [warrantyTime, setWarrantyTime] = useState(data?.warranty?.wTime || "");

   // this is global variable of categories states
   const sub_category = newCategory && newCategory.find(e => e.category === category);
   const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === subCategory);
   // const super_category = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === postCategory);


   const handleTitle = (value) => {
      let slugs = slugMaker(value);

      setSlug(slugs);
   }

   const handlePaymentMode = (e) => {
      const { value, checked } = e.target;
      const { payment_info } = paymentInfo;
      if (checked) {
         setPaymentInfo({
            payment_info: [...payment_info, value],
         });
      } else {
         setPaymentInfo({
            payment_info: payment_info.filter((e) => e !== value)
         });
      }
   }


   async function productIntroHandler(e) {
      try {
         e.preventDefault();

         let warranty = {
            wType: warrantyType,
            wTime: warrantyTime
         }

         let payments = paymentInfo?.payment_info;

         let formData = new FormData(e.currentTarget);
         formData.append('slug', slug)

         if (formTypes !== 'update') {
            formData.append('category', category);
            formData.append('subCategory', subCategory);
            formData.append('postCategory', postCategory);
         }

         formData = Object.fromEntries(formData.entries());
         formData['warranty'] = warranty;
         formData['paymentInformation'] = payments;

         const notEmpty = Object.values(formData).every(x => x !== null && x !== '');

         if (!notEmpty) {
            return setMessage("Required all fields!!!", 'danger');
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/set-product-intro/${formTypes}`, {
            method: 'POST',
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id
            },
            body: JSON.stringify(formData)
         });

         const resData = await response.json();
         setActionLoading(false);

         if (response.status === 401 || response.status === 403) {
            await authLogout();
            navigate(`/login?err=${resData?.error}`);
         }

         if (response.ok) {
            if (formTypes === "create") {
               e.target.reset();
            } else {
               refetch();
            }
            setMessage(resData?.message, 'success');
         }

      } catch (error) {
         setMessage(error?.message, 'danger');
      } finally {
         setActionLoading(false);
      }
   }

   return (
      <form onSubmit={productIntroHandler} encType="multipart/form-data">
         <div className="card_default card_description">
            <h6>Product Intro</h6>
            {msg}
            <div className="row my-4">

               <div className="col-lg-12 my-2">
                  <label htmlFor="title">{required} Title</label>
                  <input className='form-control form-control-sm' type="text" name='title' id='title' defaultValue={data?.title || ""} onChange={(e) => handleTitle(e.target.value)} />
                  <input className='form-control form-control-sm mt-1' key={slug || ""} defaultValue={slug || ""} type="text" disabled />
               </div>

               {/* Brand */}
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='brand'>{required} Brand</label>
                  <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={data?.brand || ""} placeholder="Brand Name..." />
               </div>

               {
                  formTypes !== 'update' && <>
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='category'>{required} Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="category" id="category" onChange={(e) => setCategory(e.target.value)}>

                           {category && <option value={category}>{category}</option>}
                           <option value={""}>{"Choose"}</option>
                           {
                              newCategory && newCategory.map((category, index) => {
                                 return (
                                    <option value={category?.category} key={index}>{category?.category}</option>
                                 )
                              })
                           }
                        </select>
                     </div>

                     {/* Sub Category */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='sub_category'>{required} Sub Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="sub_category" id="sub_category" onChange={(e) => setSubCategory(e.target.value)}>
                           {subCategory && <option value={subCategory}>{subCategory}</option>}
                           <option value="">Choose</option>

                           {
                              sub_category?.sub_category_items && sub_category?.sub_category_items.map((category, index) => {
                                 return (
                                    <option value={category?.name} key={index}>{category?.name}</option>
                                 )
                              })
                           }
                        </select>
                     </div>

                     {/* Post Category */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='post_category'>{required} Post Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="post_category" id="post_category" onChange={(e) => setPostCategory(e.target.value)}>
                           {postCategory && <option value={postCategory}>{postCategory}</option>}
                           <option value={""}>{"Choose"}</option>
                           {
                              post_category?.post_category_items && post_category?.post_category_items.map((c, i) => {
                                 return (
                                    <option value={c.name} key={i}>{c.name}</option>
                                 )
                              })
                           }
                        </select>
                     </div>

                  </>
               }


               {/* Inventory Details */}
               <div className="col-lg-12 my-2">
                  <h6>Inventory Details</h6>
                  <div className="row">
                     <div className="col-lg-3 mb-3">
                        <label htmlFor="fulfilledBy">{required} Fulfillment By</label>
                        <select name="fulfilledBy" id="fulfilledBy" className='form-select form-select-sm'>
                           <option value={data?.shipping?.fulfilledBy || ""}>{data?.shipping?.fulfilledBy || "Select One"}</option>
                           <option value="wooKart">WooKart</option>
                           <option value="seller">Seller</option>
                           <option value="smart-seller">Seller Smart</option>
                        </select>
                     </div>

                     <div className="col-lg-3 mb-3">
                        <label htmlFor="procurementType">{required} Procurement Type</label>
                        <select name="procurementType" id="procurementType" className='form-select form-select-sm'>
                           <option value={data?.shipping?.procurementType || ""}>{data?.shipping?.procurementType || "Select One"}</option>
                           <option value="instock">Instock</option>
                           <option value="express">Express</option>
                        </select>
                     </div>

                     <div className="col-lg-3 mb-3">
                        <label htmlFor="procurementSLA">{required} Procurement SLA</label>
                        <input type={'number'} name="procurementSLA" id="procurementSLA" className='form-control form-control-sm'
                           defaultValue={data?.shipping?.procurementSLA || 0} />
                     </div>

                  </div>
               </div>

               {/* Shipping Provider */}
               <div className="col-lg-12 my-2">
                  <h6>Shipping Provider</h6>
                  <div className="row">
                     {/* Shipping Provider */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='shippingProvider'>{required} Shipping Provider</label>
                        <select name="shippingProvider" id="shippingProvider" className='form-select form-select-sm'>
                           <option value={data?.shipping?.provider || ""}>{data?.shipping?.provider || "Select One"}</option>
                           <option value="wooKart">WooKart</option>
                           <option value="seller">Seller</option>
                           <option value="seller-wooKart">Seller And WooKart</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Delivery Charge To Customers */}
               <div className="col-lg-12 my-2">
                  <h6>Delivery Charge To Customers</h6>
                  <div className="row">
                     <div className="col-lg-3">
                        <label htmlFor="localCharge">Local Delivery Charge</label>
                        <input type="number" className='form-control form-control-sm'
                           name="localCharge" id="localCharge"
                           defaultValue={data?.shipping?.delivery?.localCharge || 0} />
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="zonalCharge">Zonal Delivery Charge</label>
                        <input type="number" className='form-control form-control-sm'
                           name="zonalCharge"
                           id="zonalCharge"
                           defaultValue={data?.shipping?.delivery?.zonalCharge || 0}
                        />
                     </div>
                  </div>
               </div>

               {/* Packaging Details */}
               <div className="col-lg-12 my-2">
                  <h6>Packaging Details</h6>
                  <div className="row ">

                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="packageWeight">Weight (kg)</label>
                        <input className='form-control form-control-sm' type="number" id='packageWeight' name="packageWeight"
                           defaultValue={(data?.shipping?.package?.weight) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="packageLength">Length (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='packageLength' name='packageLength'
                           defaultValue={(data?.shipping?.package?.dimension?.length) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="packageWidth">Width (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='packageWidth' name='packageWidth'
                           defaultValue={(data?.shipping?.package?.dimension?.width) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="packageHeight">Height (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='packageHeight' name='packageHeight'
                           defaultValue={((data?.shipping?.package?.dimension?.height) || "") || ""} />
                     </div>
                     <div className='col-lg-12 mb-3'>
                        <label htmlFor='inTheBox'>{required} What is in the box</label>
                        <input className='form-control form-control-sm' name="inTheBox" id='inTheBox' type="text"
                           defaultValue={(data?.shipping?.package?.inTheBox || "")} placeholder="e.g: 1 x hard disk" />
                     </div>

                  </div>
               </div>

               {/* Tax Details */}
               <div className="col-lg-12 my-2">
                  <h6>Tax Details</h6>
                  <div className="row">
                     <div className="col-lg-3">
                        <label htmlFor="taxHsn">{required} HSN</label>
                        <input type="text" className='form-control form-control-sm' name='taxHsn' id='taxHsn'
                           defaultValue={data?.tax?.hsn || ""} />
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="taxCode">{required} Tax Code</label>
                        <input type="text" className='form-control form-control-sm' name='taxCode' id='taxCode'
                           defaultValue={data?.tax?.code || ''} />
                     </div>
                  </div>
               </div>

               {/* Manufacturing Details */}
               <div className="col-lg-12 my-2">
                  <h6>Manufacturing Details</h6>
                  <div className="row">
                     <div className="col-lg-3">
                        <label htmlFor="manufacturerOrigin">{required} Country Of Origin</label>
                        <select name="manufacturerOrigin" id="manufacturerOrigin" className='form-select form-select-sm'>
                           <option value={data?.manufacturer?.origin || 'bangladesh'}>{data?.manufacturer?.origin || 'bangladesh'}</option>
                        </select>
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="manufacturerDetails">Manufacturer Details</label>
                        <input type="text" className='form-control form-control-sm' name='manufacturerDetails' id='manufacturerDetails'
                           defaultValue={data?.manufacturer?.details || ''}
                        />
                     </div>
                  </div>
               </div>

               {/* Set Payment Options */}
               <div className="col-lg-12 my-2">
                  <h6>Set Payment Options</h6>
                  {
                     paymentMode && paymentMode.map((e, i) => {
                        return (
                           <div className="col-12" key={i}>
                              <label htmlFor={e}>
                                 <input type="checkbox" className='me-3' name={e} checked={paymentInfo?.payment_info.includes(e) ? true : false} id={e} value={e} onChange={handlePaymentMode} />
                                 {e}
                              </label>
                           </div>
                        )
                     })
                  }
               </div>

               <div className="col-lg-3 my-2">
                  <label htmlFor="warrantyType">Warranty</label>
                  <select className='form-select form-select-sm' name="warrantyType" id="warrantyType"
                     onChange={(e) => setWarrantyType(e.target.value)}>
                     {data?.warranty?.wType &&
                        <option value={data?.warranty?.wType}>{data?.warranty?.wType}</option>}
                     <option value="">Choose Warranty Types</option>
                     <option value={"seller_warranty"}>Seller Warranty</option>
                     <option value="brand_warranty">Brand Warranty</option>
                     <option value="no_warranty">No Warranty</option>
                  </select>
               </div>

               {
                  warrantyType === "seller_warranty" &&
                  <div className="col-lg-3">
                     <label htmlFor="warrantyTime">Choose Warranty Time</label>
                     <select className='form-select form-select-sm' name="warrantyTime" id="warrantyTime"
                        onChange={(e) => setWarrantyTime(e.target.value)}>

                        {
                           data?.warranty?.wTime &&
                           <option value={data?.warranty.wTime}>{data?.warranty?.wTime}</option>
                        }
                        <option value="">Choose Warranty Time</option>
                        <option value={"6-months"}>6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="1.5-years">1.5 Years</option>
                        <option value="2-years">2 Years</option>
                     </select>
                  </div>
               }


               <div className="col-lg-12">
                  {msg}
                  <button className='bt9_edit' type="submit">
                     {
                        actionLoading ? <BtnSpinner text={formTypes === "create" ? "Saving..." : "Updating..."} /> :
                           formTypes === "create" ? "Save" : "Update"
                     }
                  </button>
               </div>
            </div>
         </div>

      </form >
   );
};

export default ProductListing;
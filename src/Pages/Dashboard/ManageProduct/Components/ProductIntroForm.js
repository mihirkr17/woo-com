import React, { useState } from 'react';
import { authLogout, slugMaker } from '../../../../Shared/common';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useMessage } from '../../../../Hooks/useMessage';
import { newCategory } from '../../../../Assets/CustomData/categories';
import { paymentMode } from '../../../../Assets/CustomData/paymentMode';

const ProductIntroForm = ({ required, userInfo, formTypes, data, refetch }) => {


   const [actionLoading, setActionLoading] = useState(false);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();
   // Category states
   const [category, setCategory] = useState((data?.categories && data?.categories[0]) || '');
   const [subCategory, setSubCategory] = useState((data?.categories && data?.categories[1]) || '');
   const [postCategory, setPostCategory] = useState((data?.categories && data?.categories[2]) || '');

   const [paymentInfo, setPaymentInfo] = useState({ payment_info: data?.pInformation || [] });


   const [warrantyType, setWarrantyType] = useState(data?.bodyInfo?.warranty?.wType || "");
   const [warrantyTime, setWarrantyTime] = useState(data?.bodyInfo?.warranty?.wTime || "");

   // this is global variable of categories states
   const sub_category = newCategory && newCategory.find(e => e.category === category);
   const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === subCategory);
   const super_category = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === postCategory);


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
         let brand = e.target.brand.value;
         let shippingProvider = e.target.shippingProvider.value;
         let localDeliveryCharge = e.target.localDeliveryCharge.value;
         let zonalDeliveryCharge = e.target.zonalDeliveryCharge.value;
         let nationalDeliveryCharge = e.target.nationalDeliveryCharge.value;
         let packageWeight = e.target.package_weight.value;
         let packageLength = e.target.package_length.value;
         let packageWidth = e.target.package_width.value;
         let packageHeight = e.target.package_height.value;
         let inTheBox = e.target.inTheBox.value;
         let hsn = e.target.hsn.value;
         let taxCode = e.target.taxCode.value;
         let countryOfOrigin = e.target.countryOfOrigin.value;
         let manufacturerDetails = e.target.manufacturerDetails.value;
         let packerDetails = e.target.packerDetails.value;
         let fulfillmentBy = e.target.fulfillmentBy.value;
         let procurementType = e.target.procurementType.value;
         let procurementSLA = e.target.procurementSLA.value;

         let obj = {
            brand,
            shippingProvider,
            localDeliveryCharge,
            zonalDeliveryCharge,
            nationalDeliveryCharge,
            packageWeight,
            packageHeight,
            packageLength,
            packageWidth,
            inTheBox,
            hsn,
            taxCode,
            countryOfOrigin,
            manufacturerDetails,
            packerDetails,
            fulfillmentBy,
            procurementType,
            procurementSLA,
            paymentInfo: paymentInfo?.payment_info,
            category, subCategory, postCategory,
            productId: data?._id,
            warranty: {
               wType: warrantyType,
               wTime: warrantyTime
            }
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/set-product-intro/${formTypes}`, {
            method: 'POST',
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
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
      <form onSubmit={productIntroHandler}>
         <div className="card_default card_description">
            <h6>Product Intro</h6>
            {msg}
            <div className="row my-4">

               {/* Brand */}
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='brand'>{required} Brand</label>
                  <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={data?.brand || ""} placeholder="Brand Name..." />
               </div>

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



               {/* Inventory Details */}
               <div className="col-lg-12 my-2">
                  <h6>Inventory Details</h6>
                  <div className="row">
                     <div className="col-lg-3 mb-3">
                        <label htmlFor="fulfillmentBy">{required} Fulfillment By</label>
                        <select name="fulfillmentBy" id="fulfillmentBy" className='form-select form-select-sm'>
                           <option value={data?.inventoryDetails?.fulfillmentBy || ""}>{data?.inventoryDetails?.fulfillmentBy || "Select One"}</option>
                           <option value="seller">Seller</option>
                           <option value="seller-smart">Seller Smart</option>
                        </select>
                     </div>

                     <div className="col-lg-3 mb-3">
                        <label htmlFor="procurementType">{required} Procurement Type</label>
                        <select name="procurementType" id="procurementType" className='form-select form-select-sm'>
                           <option value={data?.inventoryDetails?.procurementType || ""}>{data?.inventoryDetails?.procurementType || "Select One"}</option>
                           <option value="instock">Instock</option>
                           <option value="express">Express</option>
                        </select>
                     </div>

                     <div className="col-lg-3 mb-3">
                        <label htmlFor="procurementSLA">{required} Procurement SLA</label>
                        <input type={'number'} name="procurementSLA" id="procurementSLA" className='form-control form-control-sm'
                           defaultValue={data?.inventoryDetails?.procurementSLA || 0} />
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
                           <option value={data?.deliveryDetails?.shippingProvider || ""}>{data?.deliveryDetails?.shippingProvider || "Select One"}</option>
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
                        <label htmlFor="localDeliveryCharge">Local Delivery Charge</label>
                        <input type="number" className='form-control form-control-sm'
                           name="localDeliveryCharge" id="localDeliveryCharge"
                           defaultValue={data?.deliveryDetails?.localDeliveryCharge || 0} />
                     </div>
                     <div className="col-lg-3">
                        <label htmlFor="zonalDeliveryCharge">Zonal Delivery Charge</label>
                        <input type="number" className='form-control form-control-sm'
                           name="zonalDeliveryCharge"
                           id="zonalDeliveryCharge"
                           defaultValue={data?.deliveryDetails?.zonalDeliveryCharge || 0}
                        />
                     </div>
                     <div className="col-lg-3">
                        <label htmlFor="nationalDeliveryCharge">National Delivery Charge</label>
                        <input type="number" className='form-control form-control-sm'
                           name="nationalDeliveryCharge" id="nationalDeliveryCharge"
                           defaultValue={data?.deliveryDetails?.nationalDeliveryCharge || 0}
                        />
                     </div>
                  </div>
               </div>

               {/* Packaging Details */}
               <div className="col-lg-12 my-2">
                  <h6>Packaging Details</h6>
                  <div className="row ">

                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_weight">Weight (kg)</label>
                        <input className='form-control form-control-sm' type="number" id='package_weight' name="package_weight"
                           defaultValue={(data?.packageInfo?.weight) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_length">Length (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='package_length' name='package_length'
                           defaultValue={(data?.packageInfo?.dimension?.length) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_width">Width (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='package_width' name='package_width'
                           defaultValue={(data?.packageInfo?.dimension?.width) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_height">Height (cm)</label>
                        <input className='form-control form-control-sm' type="number" id='package_height' name='package_height'
                           defaultValue={((data?.packageInfo?.dimension?.height) || "") || ""} />
                     </div>
                     <div className='col-lg-12 mb-3'>
                        <label htmlFor='inTheBox'>{required} What is in the box</label>
                        <input className='form-control form-control-sm' name="inTheBox" id='inTheBox' type="text"
                           defaultValue={(data?.packageInfo?.inTheBox || "")} placeholder="e.g: 1 x hard disk" />
                     </div>

                  </div>
               </div>

               {/* Tax Details */}
               <div className="col-lg-12 my-2">
                  <h6>Tax Details</h6>
                  <div className="row">
                     <div className="col-lg-3">
                        <label htmlFor="hsn">{required} HSN</label>
                        <input type="text" className='form-control form-control-sm' name='hsn' id='hsn'
                           defaultValue={data?.taxDetails?.hsn || ""} />
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="taxCode">{required} Tax Code</label>
                        <input type="text" className='form-control form-control-sm' name='taxCode' id='taxCode'
                           defaultValue={data?.taxDetails?.taxCode || ''} />
                     </div>
                  </div>
               </div>

               {/* Manufacturing Details */}
               <div className="col-lg-12 my-2">
                  <h6>Manufacturing Details</h6>
                  <div className="row">
                     <div className="col-lg-3">
                        <label htmlFor="countryOfOrigin">{required} Country Of Origin</label>
                        <select name="countryOfOrigin" id="countryOfOrigin" className='form-select form-select-sm'>
                           <option value={data?.manufacturing?.countryOfOrigin || 'bangladesh'}>{data?.manufacturing?.countryOfOrigin || 'bangladesh'}</option>
                        </select>
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="manufacturerDetails">Manufacturer Details</label>
                        <input type="text" className='form-control form-control-sm' name='manufacturerDetails' id='manufacturerDetails'
                           defaultValue={data?.manufacturing?.manufacturerDetails || ''}
                        />
                     </div>

                     <div className="col-lg-3">
                        <label htmlFor="packerDetails">Packer Details</label>
                        <input type="text" className='form-control form-control-sm' name='packerDetails' id='packerDetails'
                           defaultValue={data?.manufacturing?.packerDetails || ''}
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

export default ProductIntroForm;
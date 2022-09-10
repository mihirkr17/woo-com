import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { usePrice } from '../../../../Hooks/usePrice';
import { useMessage } from '../../../../Hooks/useMessage';
import { loggedOut, slugMaker } from '../../../../Shared/common';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useNavigate } from 'react-router-dom';
import { newCategory } from '../../../../Assets/CustomData/categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { paymentMode } from '../../../../Assets/CustomData/paymentMode';

const ProductTemplateForm = ({ userInfo, formTypes, data, refetch }) => {
   // input variables states
   const [description, setDescription] = useState((data?.info?.description && data?.info?.description) || "CKEditor v5");
   const [shortDescription, setShortDescription] = useState((data?.info?.short_description && data?.info?.short_description) || "");
   const [inputPriceDiscount, setInputPriceDiscount] = useState({ price: (data?.pricing?.price && data?.pricing?.price) || "", sellingPrice: (data?.pricing?.sellingPrice && data?.pricing?.sellingPrice) || "" });
   const { discount } = usePrice(inputPriceDiscount.price, inputPriceDiscount.sellingPrice);
   const [status, setStatus] = useState(data?.status || "");
   const [images, setImages] = useState(data?.image || []);
   const [specification, setSpecification] = useState((data?.info?.specification.length > 0 && data?.info?.specification) || [{ type: "", value: "" }]);
   const [category, setCategory] = useState(data?.genre?.category || "");
   const [subCategory, setSubCategory] = useState(data?.genre?.sub_category || "");
   const [postCategory, setPostCategory] = useState(data?.genre?.post_category || "");
   const [sizes, setSizes] = useState({ size: data?.info?.size || [] });
   const [brand, setBrand] = useState(data?.brand || "");
   const [sku, setSku] = useState(data?.sku || "");
   const [available, setAvailable] = useState(data?.available || "");
   const [inBox, setInBox] = useState(data?.delivery_service?.in_box || "");
   const [paymentOption, setPaymentOption] = useState({ payment_option: data?.payment_option || [] });
   const [warrantyType, setWarrantyType] = useState(data?.delivery_service?.warrantyType || "");
   const [warrantyTime, setWarrantyTime] = useState(data?.delivery_service?.warrantyTime || "");

   // others necessary states
   const { msg, setMessage } = useMessage();
   const [actionLoading, setActionLoading] = useState(false);
   const navigate = useNavigate();

   // this is global variable of categories states
   const sub_category = newCategory && newCategory.find(e => e.category === category);
   const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.sub_category === subCategory);

   // images upload handlers 
   const imageInputHandler = (e, index) => {
      const { value } = e.target;
      let list = [...images];
      list[index] = value;
      setImages(list);
   }

   const removeImageInputFieldHandler = (index) => {
      let listArr = [...images];
      listArr.splice(index, 1);
      setImages(listArr);
   }

   // specification input handlers
   const specificationInputHandler = (e, index) => {
      const { name, value } = e.target;
      let list = [...specification];
      list[index][name] = value;
      setSpecification(list);
   };

   const removeSpecificationInputFieldHandler = index => {
      const list = [...specification];
      list.splice(index, 1);
      setSpecification(list);
   };

   // size handler
   const handleSize = (e) => {
      const { value, checked } = e.target;
      const { size } = sizes;
      if (checked) {
         setSizes({
            size: [...size, value],
         });
      } else {
         setSizes({
            size: size.filter((e) => e !== value)
         });
      }
   }

   const handlePaymentMode = (e) => {
      const { value, checked } = e.target;
      const { payment_option } = paymentOption;
      if (checked) {
         setPaymentOption({
            payment_option: [...payment_option, value],
         });
      } else {
         setPaymentOption({
            payment_option: payment_option.filter((e) => e !== value)
         });
      }
   }


   const productHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);
      const title = e.target.title.value;
      const slug = slugMaker(title);

      // package dimension
      let packageWeight = e.target.package_weight.value;
      let packageLength = e.target.package_length.value;
      let packageWidth = e.target.package_width.value;
      let packageHeight = e.target.package_height.value;

      let product = {
         title,
         slug,
         images,
         description,
         short_description: shortDescription,
         specification,
         size: sizes?.size,
         inBox,
         warrantyType,
         warrantyTime,
         pricing: {
            price: parseFloat(inputPriceDiscount.price),
            sellingPrice: parseFloat(inputPriceDiscount.sellingPrice),
            discount: discount,
            currency: "BDT"
         },
         available: parseInt(available),
         packageWeight: parseFloat(packageWeight),
         packageLength: parseFloat(packageLength),
         packageWidth: parseFloat(packageWidth),
         packageHeight: parseFloat(packageHeight),
         sku,
         status,
         payment_option: paymentOption?.payment_option
      }

      if (formTypes === "create") {
         product["brand"] = brand;
         product["category"] = category;
         product["subCategory"] = subCategory;
         product["postCategory"] = postCategory;
         product["seller"] = userInfo?.seller;
      }

      const requestType = {
         url: formTypes === "update" ? `${process.env.REACT_APP_BASE_URL}api/product/update-product/${data?._id && data?._id}` :
            `${process.env.REACT_APP_BASE_URL}api/product/add-product`,
         method: formTypes === "update" ? "PUT" : "POST"
      }

      if (
         (title || images.length < 0 ||
            shortDescription || category ||
            subCategory || inputPriceDiscount.price || brand ||
            postCategory || packageWeight || packageLength || packageWidth || packageHeight) === ""
      ) {
         setMessage(<p className='text-danger'><small><strong>Required All Input Fields !</strong></small></p>);
         setActionLoading(false);
         return;
      } else {
         const response = await fetch(requestType?.url, {
            method: requestType?.method,
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
         });

         const resData = await response.json();

         if (response.ok) {
            setActionLoading(false);

            if (formTypes === "create") {
               e.target.reset();
            } else {
               refetch();
            }
            setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
         } else {
            setActionLoading(false);

            if (response.status === 401 || response.status === 403) {
               await loggedOut();
               navigate(`/login?err=${resData?.error}`);
            }
         }
      }
   }

   const required = <span style={{ color: "red" }}>*</span>;

   return (
      <Form onSubmit={productHandler}>
         <div className="card_default card_description">
            <h6>Product Intro</h6>
            <div className="row my-4">
               <div className='col-lg-12 mb-3'>
                  <label htmlFor='title'>{required} Title</label>
                  <input className='form-control form-control-sm' name="title" id='title' type="text" defaultValue={(data?.title && data?.title) || ""} placeholder="Title" />
               </div>

               <div className="col-lg-12 mb-3">
                  <label htmlFor='image'>{required} Image(<small>Product Image</small>)&nbsp;
                     <span className="badge bg-primary p-2 btn-sm" onClick={() => setImages([...images, ''])}>Add New Image</span>
                  </label>
                  {
                     images && images.map((img, index) => {
                        return (
                           <div className="py-2 d-flex align-items-end" key={index}>

                              <div className="row w-100">
                                 <div className="col-lg-12 mb-3">
                                    <input className="form-control form-control-sm" name="image" id='image' type="text"
                                       placeholder='Image url' value={img} onChange={(e) => imageInputHandler(e, index)}></input>
                                 </div>
                              </div>

                              <div className="btn-box d-flex ms-4 mb-3">
                                 <span
                                    className="btn me-2 btn-sm"
                                    onClick={() => removeImageInputFieldHandler(index)}>
                                    <FontAwesomeIcon icon={faMinusSquare} />
                                 </span>
                              </div>
                           </div>
                        )
                     })
                  }
                  <div className="py-2">
                     {
                        images && images.map((img, index) => {
                           return (
                              <img style={{ width: "70px", height: "70px" }} key={index} src={img} alt="" srcset="" />
                           )
                        })
                     }
                  </div>
               </div>
            </div>
         </div>

         <div className="card_default card_description my-4">
            <h6>Product Attributes</h6>
            <div className="row my-4">
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='price'>{required} Price</label>
                  <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputPriceDiscount.price || ""} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
               </div>

               <div className='col-lg-3 mb-3'>
                  <label htmlFor='sellingPrice'>Selling Price<small>(Discount : {discount || 0})</small></label>
                  <input name='sellingPrice' id='sellingPrice' type='number' className="form-control form-control-sm" value={inputPriceDiscount.sellingPrice} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
               </div>

               <div className='col-lg-3 mb-3'>
                  <label htmlFor='available'>{required} Stock</label>
                  <input className='form-control form-control-sm' name='available' id='available' type='number' value={(available)} onChange={e => setAvailable(e.target.value)} />
               </div>
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='sku'>{required} SKU</label>
                  <input className='form-control form-control-sm' name='sku' id='sku' type='text' value={sku || ""} onChange={e => setSku(e.target.value)} />
               </div>

               {
                  formTypes === "create" &&
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='brand'>{required} Brand</label>
                     <input name="brand" id='brand' className='form-control form-control-sm' type="text" value={brand || ""} onChange={(e) => setBrand(e.target.value)} placeholder="Brand Name..." />
                  </div>
               }

               {
                  formTypes === "create" && <>
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='category'>{required} Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
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

                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='sub_category'>{required} Sub Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="sub_category" id="sub_category" onChange={(e) => setSubCategory(e.target.value)}>
                           <option value="">{"Choose"}</option>
                           {
                              sub_category?.sub_category_items && sub_category?.sub_category_items.map((category, index) => {
                                 return (
                                    <option value={category?.sub_category} key={index}>{category?.sub_category}</option>
                                 )
                              })
                           }
                        </select>
                     </div>

                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='post_category'>{required} Second Category</label> <br />
                        <select className="form-select form-select-sm text-capitalize" name="post_category" id="post_category" onChange={(e) => setPostCategory(e.target.value)}>
                           <option value={""}>{"Choose"}</option>
                           {
                              post_category?.post_category_items && post_category?.post_category_items.map((c, i) => {
                                 return (
                                    <option value={c} key={i}>{c}</option>
                                 )
                              })
                           }
                        </select>
                     </div>
                  </>
               }

               {
                  (post_category?.size) && <div className="row">
                     <div className="col-12">
                        <strong>Select Size</strong>
                     </div>
                     {
                        post_category?.size && post_category?.size.map((e, i) => {
                           return (
                              <div className="col-12" key={i}>
                                 <label htmlFor={e}>
                                    <input type="checkbox" className='me-3' name={e} checked={sizes?.size.includes(e) ? true : false} id={e} value={e} onChange={handleSize} />
                                    {e}
                                 </label>
                              </div>
                           )
                        })
                     }

                  </div>
               }
            </div>

         </div>

         <div className="card_default card_description my-4">
            <div className="row">
               <h6>Product Details </h6>
               <div className='col-lg-12 mb-3'>
                  <label htmlFor='short_description'>{required} Short Description</label>
                  <textarea className='form-control form-control-sm' name="short_description" id='short_description' type="text" value={shortDescription || ""} onChange={e => setShortDescription(e.target.value)} placeholder="Short description" />
               </div>

               <div className="col-lg-12 mb-3">
                  <label htmlFor='description'>Description</label>
                  <CKEditor editor={ClassicEditor}
                     data={description}
                     onChange={(event, editor) => {
                        const data = editor.getData();
                        return setDescription(data);
                     }}
                  />
               </div>

               <div className="col-lg-12 mb-3">
                  {
                     specification && specification.map((x, i) => {
                        return (
                           <div className="py-2 d-flex align-items-end" key={i}>

                              <div className="row w-100">
                                 <div className="col-lg-6">
                                    <label htmlFor='type'>Specification Type</label>
                                    <input className="form-control form-control-sm" name="type" id='type' type="text" placeholder='Spec type' value={x.type} onChange={(e) => specificationInputHandler(e, i)}></input>
                                 </div>

                                 <div className="col-lg-6">
                                    <label htmlFor='value'>Specification Value</label>
                                    <input className="form-control form-control-sm" name="value" id='value' type="text" placeholder='Spec_value' value={x.value} onChange={(e) => specificationInputHandler(e, i)}></input>
                                 </div>
                              </div>

                              <div className="btn-box d-flex ms-4 mb-3">
                                 {specification.length !== 1 && <button
                                    className="btn me-2 btn-sm"
                                    onClick={() => removeSpecificationInputFieldHandler(i)}> <FontAwesomeIcon icon={faMinusSquare} /></button>}
                                 {specification.length - 1 === i && <button className="btn btn-sm" onClick={() => setSpecification([...specification, { type: "", value: "" }])}>
                                    <FontAwesomeIcon icon={faPlusSquare} />
                                 </button>}
                              </div>
                           </div>
                        )
                     })
                  }
               </div>


            </div>
         </div>

         {/* // service and delivery  */}
         <div className="card_default card_description my-4">
            <h6>Service & Delivery</h6>
            <div className="row ">
               <div className="col-lg-12">
                  <p>Package Dimensions (cm) <span style={{ color: "red" }}>*</span></p>
                  <div className="row">
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_weight">Weight (kg)</label>
                        <input className='form-control form-control-sm' type="text" id='package_weight' name="package_weight" defaultValue={(data?.package_dimension?.weight) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_length">Length (cm)</label>
                        <input className='form-control form-control-sm' type="text" id='package_length' name='package_length' defaultValue={(data?.package_dimension?.length) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_width">Width (cm)</label>
                        <input className='form-control form-control-sm' type="text" id='package_width' name='package_width' defaultValue={(data?.package_dimension?.width) || ""} />
                     </div>
                     <div className="col-lg-3 col-sm-6 mb-2">
                        <label htmlFor="package_height">Height (cm)</label>
                        <input className='form-control form-control-sm' type="text" id='package_height' name='package_height' defaultValue={(data?.package_dimension?.height) || ""} />
                     </div>
                     <div className='col-lg-12 mb-3'>
                        <label htmlFor='in_box'>{required} What is in the box</label>
                        <input className='form-control form-control-sm' name="in_box" id='in_box' type="text" value={(inBox || "")} onChange={e => setInBox(e.target.value)} placeholder="e.g: 1 x hard disk" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="card_default card_description my-4">
            <div className="row">
               <div className="col-lg-3">
                  <label htmlFor="status">Set Status</label>
                  <select className='form-select form-select-sm' name="status" id="status" onChange={(e) => setStatus(e.target.value)}>
                     <option value={status || ""}>{status || "Select Status"}</option>
                     <option value={"active"}>Active</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </div>
               <div className="col-lg-3">
                  <label htmlFor="status">Set Payment Options</label>
                  {
                     paymentMode && paymentMode.map((e, i) => {
                        return (
                           <div className="col-12" key={i}>
                              <label htmlFor={e}>
                                 <input type="checkbox" className='me-3' name={e} checked={paymentOption?.payment_option.includes(e) ? true : false} id={e} value={e} onChange={handlePaymentMode} />
                                 {e}
                              </label>
                           </div>
                        )
                     })
                  }
               </div>
               <div className="col-lg-3">
                  <label htmlFor="warrantyType">Warranty</label>
                  <select className='form-select form-select-sm' name="warrantyType" id="warrantyType" onChange={(e) => setWarrantyType(e.target.value)}>
                     {data?.delivery_service?.warrantyType &&
                        <option value={data?.delivery_service?.warrantyType}>{data?.delivery_service?.warrantyType}</option>}
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
                     <select className='form-select form-select-sm' name="warrantyTime" id="warrantyTime" onChange={(e) => setWarrantyTime(e.target.value)}>

                        {
                           data?.delivery_service?.warrantyTime &&
                           <option value={data?.delivery_service?.warrantyTime}>{data?.delivery_service?.warrantyTime}</option>
                        }
                        <option value="">Choose Warranty Time</option>
                        <option value={"6-months"}>6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="1.5-years">1.5 Years</option>
                        <option value="2-years">2 Years</option>
                     </select>
                  </div>
               }
            </div>
         </div>

         {msg}
         <button className='btn btn-sm btn-primary' type="submit">
            {
               actionLoading ? <BtnSpinner text={formTypes === "create" ? "Adding..." : "Updating..."} /> :
                  formTypes === "create" ? "Add Product" : "Update Product"
            }
         </button>
      </Form >
   );
};

export default ProductTemplateForm;
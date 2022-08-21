import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { usePrice } from '../Hooks/usePrice';
import { useMessage } from '../Hooks/useMessage';
import { loggedOut, slugMaker } from './common';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { useNavigate } from 'react-router-dom';
import { newCategory } from '../Assets/CustomData/categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const ProductTemplateForm = ({ userInfo, formTypes, data, modalClose, refetch }) => {
   const navigate = useNavigate();
   const [desc, setDescription] = useState((data?.description && data?.description) || "CKEditor v5");
   const [inputValue, setInputValue] = useState({ price: (data?.price && data?.price) || "", discount: (data?.discount && data?.discount) || "" });
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);
   const { msg, setMessage } = useMessage();
   const newDate = new Date();
   const [actionLoading, setActionLoading] = useState(false);

   const [status, setStatus] = useState(data?.status || "");

   // image link
   const [images, setImages] = useState(data?.image || []);

   const [specInp, setSpecInp] = useState(data?.info?.specification || [{ type: "", value: "" }]);

   const [category, setCategory] = useState("");
   const [subCategory, setSubCategory] = useState("");
   const [postCategory, setPostCategory] = useState("");

   const sub_category = newCategory && newCategory.find(e => e.category === category);
   const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.sub_category === subCategory);

   const [sizes, setSizes] = useState({ size: data?.info?.size || [] });


   const handleImages = (e, index) => {
      const { value } = e.target;
      let list = [...images];
      list[index] = value;
      setImages(list);
   }

   const addImageInputField = () => {
      setImages([...images, '']);
   }

   const removeImageInputField = (index) => {
      let listArr = [...images];
      listArr.splice(index, 1);
      setImages(listArr);
   }

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   const addSpecInputFieldHandler = () => {
      setSpecInp([...specInp, { type: "", value: "" }])
   }

   // handle input change
   const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      let list = [...specInp];
      list[index][name] = value;
      setSpecInp(list);
   };
   // handle click event of the Remove button
   const removeSpecInputFieldHandler = index => {
      const list = [...specInp];
      list.splice(index, 1);
      setSpecInp(list);
   };

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


   const productHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      const title = e.target.title.value;
      const slug = slugMaker(title);
      const description = desc;
      const short_description = e.target.short_description.value;
      const inBox = e.target.in_box.value;
      const specification = specInp;
      const price = inputValue.price;
      const discount = inputValue.discount;
      const available = e.target.available.value;
      const brand = e.target.brand.value;

      // package dimension
      let packageWeight = e.target.package_weight.value;
      let packageLength = e.target.package_length.value;
      let packageWidth = e.target.package_width.value;
      let packageHeight = e.target.package_height.value;

      // seller sku
      const sellerSku = e.target.seller_sku.value;


      let product = {
         title,
         slug,
         brand,
         image: images,
         info: {
            description,
            short_description,
            specification,
            size: sizes?.size,
            in_box: inBox
         },
         price: parseFloat(price),
         price_fixed,
         discount: parseFloat(discount),
         discount_amount_fixed,
         available: parseInt(available),
         package_dimension: {
            weight: parseFloat(packageWeight),
            length: parseFloat(packageLength),
            width: parseFloat(packageWidth),
            height: parseFloat(packageHeight)
         },
         seller_sku: sellerSku,
         status
      }

      if (formTypes === "update") {
         product["modifiedAt"] = newDate.toLocaleString();
      } else {
         product["genre"] = {
            category: category, // category
            sub_category: subCategory, // sub category
            post_category: postCategory // third category
         }
         product["seller"] = userInfo?.seller;
         product["rating"] = [
            { weight: 5, count: 0 },
            { weight: 4, count: 0 },
            { weight: 3, count: 0 },
            { weight: 2, count: 0 },
            { weight: 1, count: 0 },
         ];
         product["rating_average"] = 0;
         product["createAt"] = newDate.toLocaleString();
      }

      const requestType = {
         url: formTypes === "update" ? `${process.env.REACT_APP_BASE_URL}api/update-product/${data?._id && data?._id}` : `${process.env.REACT_APP_BASE_URL}api/add-product`,
         method: formTypes === "update" ? "PUT" : "POST"
      }

      if (
         (title || images.length < 0 ||
            short_description || category ||
            subCategory || price ||
            brand || postCategory || packageWeight || packageLength || packageWidth || packageHeight) === ""
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
               setMessage(<p className='text-success'><small><strong>Product Added Successfully</strong></small></p>);
               e.target.reset();
            } else {
               resData && refetch();
               modalClose();
               setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
            }
         } else {
            setActionLoading(false);
            await loggedOut();
            navigate("/login?err= token not found");
         }
      }
   }

   return (
      <Form onSubmit={productHandler}>
         <div className="row my-4">
            <div className='col-lg-12 mb-3'>
               <label htmlFor='title'>Title <span style={{ color: "red" }}>*</span></label>
               <input className='form-control form-control-sm' name="title" id='title' type="text" defaultValue={(data?.title && data?.title) || ""} placeholder="Title" />
            </div>

            <div className="col-lg-12 mb-3">
               <label htmlFor='image'>Image(<small>Product Image</small>)&nbsp;
                  <span className="badge bg-primary p-2 btn-sm" onClick={addImageInputField}>Add New Image</span>
               </label>
               {
                  images && images.map((img, index) => {
                     return (
                        <div className="py-2 d-flex align-items-end" key={index}>

                           <div className="row w-100">
                              <div className="col-lg-12 mb-3">
                                 <input className="form-control form-control-sm" name="image" id='image' type="text"
                                    placeholder='Image url' value={img} onChange={(e) => handleImages(e, index)}></input>
                              </div>
                           </div>

                           <div className="btn-box d-flex ms-4 mb-3">
                              <span
                                 className="btn btn-danger me-2 btn-sm"
                                 onClick={() => removeImageInputField(index)}>
                                 x
                              </span>
                           </div>
                        </div>
                     )
                  })
               }
            </div>
         </div>

         <div className="card_default card_description my-4">
            <h6>Product Attributes</h6>
            <div className="row my-4">
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='price'>Price <small>(Fixed Price : {price_fixed || inputValue?.price || 0})</small><span style={{ color: "red" }}>*</span></label>
                  <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputValue.price || ""} onChange={handleInput} />
               </div>

               <div className='col-lg-3 mb-3'>
                  <label htmlFor='discount'>Discount <small>(Fixed Discount : {discount_amount_fixed || 0})</small></label>
                  <input name='discount' id='discount' type='number' className="form-control form-control-sm" value={inputValue.discount} onChange={handleInput} />
               </div>
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='available'>Update Stock</label>
                  <input className='form-control form-control-sm' name='available' id='available' type='number' defaultValue={((data?.available && data?.available) || 0) || ""} />
               </div>
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='seller_sku'>Seller SKU</label>
                  <input className='form-control form-control-sm' name='seller_sku' id='seller_sku' type='text' defaultValue={(data?.seller_sku && data?.seller_sku) || ""} />
               </div>

               <div className='col-lg-3 mb-3'>
                  <label htmlFor='brand'>Brand <span style={{ color: "red" }}>*</span></label>
                  <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={(data?.brand && data?.brand) || ""} placeholder="Brand Name..." />
               </div>

               {
                  formTypes === "create" && <>
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='category'>Category <span style={{ color: "red" }}>*</span></label> <br />
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
                        <label htmlFor='sub_category'>Sub Category <span style={{ color: "red" }}>*</span></label> <br />
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
                        <label htmlFor='post_category'>Second Category <span style={{ color: "red" }}>*</span></label> <br />
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
                  <label htmlFor='short_description'>Short Description <span style={{ color: "red" }}>*</span></label>
                  <textarea className='form-control form-control-sm' name="short_description" id='short_description' type="text" defaultValue={(data?.info?.short_description && data?.info?.short_description) || ""} placeholder="Short description" />
               </div>

               <div className="col-lg-12 mb-3">
                  <label htmlFor='description'>Description</label>
                  <CKEditor editor={ClassicEditor}
                     data={desc}
                     onChange={(event, editor) => {
                        const data = editor.getData();
                        return setDescription(data);
                     }}
                  />
               </div>

               <div className="col-lg-12 mb-3">
                  <label>Specification</label>
                  {
                     specInp && specInp.map((x, i) => {
                        return (
                           <div className="py-2 d-flex align-items-end" key={i}>

                              <div className="row w-100">
                                 <div className="col-lg-6 mb-3">

                                    <input className="form-control form-control-sm" name="type" id='type' type="text" placeholder='Spec type' value={x.type} onChange={(e) => handleInputChange(e, i)}></input>
                                 </div>

                                 <div className="col-lg-6 mb-3">
                                    <input className="form-control form-control-sm" name="value" id='value' type="text" placeholder='Spec_value' value={x.value} onChange={(e) => handleInputChange(e, i)}></input>
                                 </div>
                              </div>

                              <div className="btn-box d-flex ms-4 mb-3">
                                 {specInp.length !== 1 && <button
                                    className="btn btn-danger me-2 btn-sm"
                                    onClick={() => removeSpecInputFieldHandler(i)}>Remove</button>}
                                 {specInp.length - 1 === i && <button className="btn btn-primary btn-sm" onClick={addSpecInputFieldHandler}>Add</button>}
                              </div>
                           </div>
                        )
                     })
                  }
               </div>

               <div className='col-lg-12 mb-3'>
                  <label htmlFor='in_box'>What is in the box <span style={{ color: "red" }}>*</span></label>
                  <input className='form-control form-control-sm' name="in_box" id='in_box' type="text" defaultValue={(data?.info?.in_box && data?.info?.in_box) || ""} placeholder="e.g: 1 x hard disk" />
               </div>
            </div>
         </div>

         <div className="card_default card_description my-4">
            <h6>Service & Delivery</h6>
            <div className="row ">
               <div className="col-lg-12 mb-4">
                  <label htmlFor="package_weight">Package Weight (kg) <span style={{ color: "red" }}>*</span> </label>
                  <input name="package_weight" id='package_weight' className='form-control form-control-sm' type="text" defaultValue={(data?.package_dimension?.weight) || ""} placeholder="Weight(KG)" />
               </div>
               <div className="col-lg-12">
                  <p>Package Dimensions (cm) <span style={{ color: "red" }}>*</span></p>
                  <div className="row">
                     <div className="col-4">
                        <input className='form-control form-control-sm' type="text" name='package_length' defaultValue={(data?.package_dimension?.length) || ""} placeholder='Length (cm)' />
                     </div>
                     <div className="col-4">
                        <input className='form-control form-control-sm' type="text" name='package_width' defaultValue={(data?.package_dimension?.width) || ""} placeholder='Width (cm)' />
                     </div>
                     <div className="col-4">
                        <input className='form-control form-control-sm' type="text" name='package_height' defaultValue={(data?.package_dimension?.height) || ""} placeholder='Height (cm)' />
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
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useCategories } from '../Hooks/useCategories';
import { usePrice } from '../Hooks/usePrice';
import { useMessage } from '../Hooks/useMessage';
import { loggedOut, slugMaker } from './common';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { useNavigate } from 'react-router-dom';

const ProductTemplateForm = ({ userInfo, formTypes, data, modalClose, refetch }) => {
   const navigate = useNavigate();
   const [desc, setDescription] = useState((data?.description && data?.description) || "CKEditor v5");
   const [inputValue, setInputValue] = useState({ price: (data?.price && data?.price) || "", discount: (data?.discount && data?.discount) || "" });
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);
   const { msg, setMessage } = useMessage();
   const newDate = new Date();
   const [actionLoading, setActionLoading] = useState(false);
   const [ctg, setCtg] = useState({ category: data?.genre?.category || "", sub_category: data?.genre?.sub_category || "", second_category: data?.genre?.second_category || "" });
   const { Categories, subCategories, secondCategories } = useCategories(ctg);

   const [specInp, setSpecInp] = useState(data?.info?.specification || [{ type: "", value: "" }]);

   const handleCtgValues = (e) => {
      let values = e.target.value;
      setCtg({ ...ctg, [e.target.name]: values })
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



   const productHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      let short_description = e.target.short_description.value;
      let specification = specInp;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let rating = [
         { weight: 5, count: 0 },
         { weight: 4, count: 0 },
         { weight: 3, count: 0 },
         { weight: 2, count: 0 },
         { weight: 1, count: 0 },
      ];
      let available = e.target.available.value;
      let brand = e.target.brand.value;

      let slug = slugMaker(title);

      const genre = {
         category: ctg?.category, // category
         sub_category: ctg?.sub_category, // sub category
         second_category: ctg?.second_category // third category
      }

      const info = {
         description,
         short_description,
         specification
      }

      let product = {
         title,
         slug,
         brand,
         image,
         description,
         info,
         genre,
         price: parseFloat(price),
         price_fixed,
         discount: parseFloat(discount),
         discount_amount_fixed,
         available: parseInt(available)
      }

      if (formTypes === "update") {
         product["modifiedAt"] = newDate.toLocaleString();
      } else {
         product["seller"] = userInfo?.seller;
         product["rating"] = rating;
         product["rating_average"] = 0;
         product["createAt"] = newDate.toLocaleString();
      }

      const requestType = {
         url: formTypes === "update" ? `${process.env.REACT_APP_BASE_URL}api/update-product/${data?._id && data?._id}` : `${process.env.REACT_APP_BASE_URL}api/add-product`,
         method: formTypes === "update" ? "PUT" : "POST"
      }

      if (
         title === "" || image === "" ||
         description === "" || ctg.category === "" ||
         ctg.sub_category === "" || price === "" ||
         discount === "" || brand === "" || ctg.second_category === ""
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
            navigate("/login?q=unauthorized");
         }
      }
   }

   const selectOption = (arr, values, oldValue) => {
      return (
         <select className="form-select form-select-sm text-capitalize" name={values} id={values} onChange={handleCtgValues}>

            {/* <option value="">Choose...</option> */}
            {oldValue ? <option value={oldValue}>{oldValue}</option> : <option value="">Choose...</option>}
            {
               arr && arr.map((c, i) => {
                  return (
                     <option value={c} key={i}>{c.replace(/[-]/g, " ")}</option>
                  )
               })
            }
         </select>
      )
   }

   return (
      <Form onSubmit={productHandler}>
         <div className="row my-4">
            <div className='col-lg-12 mb-3'>
               <label htmlFor='title'>Title</label>
               <input className='form-control form-control-sm' name="title" id='title' type="text" defaultValue={(data?.title && data?.title) || ""} placeholder="Title" />
            </div>

            <div className='col-lg-12 mb-3'>
               <label htmlFor='image'>Image</label>
               <input className='form-control form-control-sm' name="image" id='image' type="text" defaultValue={(data?.image && data?.image) || ""} placeholder="Image Link" />
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

            <div className='col-lg-12 mb-3'>
               <label htmlFor='short_description'>Short Description</label>
               <input className='form-control form-control-sm' name="short_description" id='short_description' type="text" defaultValue={(data?.info?.short_description && data?.info?.short_description) || ""} placeholder="Short description" />
            </div>
         </div>

         <div className="my-4">
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

         <div className="row my-4">
            <div className='col-lg-3 mb-3'>
               <label htmlFor='brand'>Brand</label>
               <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={(data?.brand && data?.brand) || ""} placeholder="Brand Name..." />
            </div>

            <div className='col-lg-3 mb-3'>
               <label htmlFor='category'>Category</label> <br />
               {
                  selectOption(Categories, "category", ctg?.category)
               }
            </div>

            <div className='col-lg-3 mb-3'>
               <label htmlFor='sub_category'>Sub Category</label> <br />
               {
                  selectOption(subCategories, "sub_category", ctg?.sub_category)
               }
            </div>

            <div className='col-lg-3 mb-3'>
               <label htmlFor='second_category'>Second Category</label> <br />
               {
                  selectOption(secondCategories, "second_category", ctg?.second_category)
               }
            </div>
         </div>

         <div className="row my-4">
            <div className='col-lg-4 mb-3'>
               <label htmlFor='price'>Price <small>(Fixed Price : {price_fixed || inputValue?.price || 0})</small></label>
               <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputValue.price || ""} onChange={handleInput} />
            </div>

            <div className='col-lg-4 mb-3'>
               <label htmlFor='discount'>Discount <small>(Fixed Discount : {discount_amount_fixed || 0})</small></label>
               <input name='discount' id='discount' type='number' className="form-control form-control-sm" value={inputValue.discount} onChange={handleInput} />
            </div>
            <div className='col-lg-4 mb-3'>
               <label htmlFor='available'>Update Stock</label>
               <input className='form-control form-control-sm' name='available' id='available' type='number' defaultValue={(data?.available && data?.available) || ""} />
            </div>
         </div>
         <p className="p-1 text-muted">
            <small>Warning : If you set it to 0 then product will be stock out</small>
         </p>
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
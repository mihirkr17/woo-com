import React from 'react';
import { useState } from 'react';
import { usePrice } from '../../../../Hooks/usePrice';

import { useMessage } from '../../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { slugMaker } from '../../../../Shared/common';

const VariationFormOne = ({ required, data, formTypes }) => {
   const variation = data?.variations && data?.variations;

   // Price and discount states
   const [inputPriceDiscount, setInputPriceDiscount] = useState({ price: (variation?.pricing?.price && variation?.pricing?.price) || "", sellingPrice: (variation?.pricing?.sellingPrice && variation?.pricing?.sellingPrice) || "" });
   const { discount } = usePrice(inputPriceDiscount.price, inputPriceDiscount.sellingPrice);


   const [slug, setSlug] = useState(variation?.slug || "");

   const [images, setImages] = useState((variation?.images && variation?.images) || [""]);
   const { msg, setMessage } = useMessage();

   const handleTitle = (value) => {
      let slugs = slugMaker(value);

      setSlug(slugs);
   }

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



   async function handleVariationOne(e) {
      try {
         e.preventDefault();
         // setActionLoading(true);

         const title = e.target.title.value;
         let sku = e.target.sku.value;
         let status = e.target.status.value;
         let available = e.target.available.value;


         let model = {
            pageURL: '/VariationOne',
            variations: {
               title,
               slug,
               images,
               sku,
               price: parseFloat(inputPriceDiscount.price),
               sellingPrice: parseFloat(inputPriceDiscount.sellingPrice),
               discount,
               status,
               available,
            }
         }


         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/set-product-variation?formType=${formTypes}&vId=${variation?.vId || ""}&attr=variationOne`, {
            withCredentials: true,
            credentials: 'include',
            method: 'PUT',
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id && data?._id
            },
            body: JSON.stringify({ request: model })
         });

         const resData = await response.json();

         if (response.ok) {
            setMessage(resData?.message, 'success');
            return;
         }

         setMessage(resData?.error, 'danger');


      } catch (error) {
         setMessage(error?.message, 'danger')
      }
   }


   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }



   return (
      <form onSubmit={handleVariationOne}>
         {/* Price Stock And Shipping Information */}
         <div className="row my-4">
            <div className="col-lg-12 my-2">
               <label htmlFor="title">Title</label>
               <input className='form-control form-control-sm' type="text" name='title' id='title' defaultValue={variation?.title || ""} onChange={(e) => handleTitle(e.target.value)} />
               <input className='form-control form-control-sm mt-1' key={slug || ""} defaultValue={slug || ""} type="text" disabled />
            </div>



            <div className="col-lg-12 py-2">
               <label htmlFor='image'>{required} Image(<small>Product Image</small>)&nbsp;</label>
               {
                  images && images.map((img, index) => {
                     return (
                        <div className="py-2 d-flex align-items-end justify-content-start" key={index}>
                           <input className="form-control form-control-sm" name="image" id='image' type="text"
                              placeholder='Image url' value={img} onChange={(e) => imageInputHandler(e, index)}></input>

                           {
                              images.length !== 1 && <span
                                 style={btnStyle}
                                 onClick={() => removeImageInputFieldHandler(index)}>
                                 <FontAwesomeIcon icon={faMinusSquare} />
                              </span>
                           } {
                              images.length - 1 === index && <span style={btnStyle}
                                 onClick={() => setImages([...images, ''])}>
                                 <FontAwesomeIcon icon={faPlusSquare} />
                              </span>
                           }

                        </div>
                     )
                  })
               }
               <div className="py-2">
                  {
                     images && images.map((img, index) => {
                        return (
                           <img style={{ width: "180px", height: "auto" }} key={index} srcSet={img} alt="" />
                        )
                     })
                  }
               </div>
            </div>

            {/* SKU */}
            <div className='col-lg-3 mb-3'>
               <label htmlFor='sku'>{required} SKU <small>(Stock Keeping Unit)</small></label>
               <input className='form-control form-control-sm' name='sku' id='sku' type='text' defaultValue={variation?.sku || ""} />
            </div>

            <div className="col-lg-12 my-2">
               <h6>Status Details</h6>
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
               <h6>Price Details</h6>
               <div className="row">
                  {/* Price */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='price'>{required} Price (BDT)</label>
                     <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputPriceDiscount.price || ""} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
                  </div>

                  {/* Selling Price */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='sellingPrice'>Selling Price<small>(Discount : {discount || 0}%)</small></label>
                     <input name='sellingPrice' id='sellingPrice' type='number' className="form-control form-control-sm" value={inputPriceDiscount.sellingPrice} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
                  </div>

                  {/* Stock */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='available'>{required} Stock</label>
                     <input className='form-control form-control-sm' name='available' id='available' type='number'
                        defaultValue={variation?.available} />
                  </div>
               </div>
            </div>

         </div>


         <div className="col-lg-12 my-2 pt-4">
            {msg}
            <button type='submit' className='bt9_edit'>Save</button>
         </div>
      </form>
   )
}

export default VariationFormOne;
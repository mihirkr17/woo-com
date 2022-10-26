import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useMessage } from '../../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { authLogout } from '../../../../Shared/common';

const ProductPhotoForm = ({ required, userInfo, formTypes, data, refetch }) => {
   const [images, setImages] = useState(data?.images || [""]);
   const [actionLoading, setActionLoading] = useState(false);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();

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

   async function productPhotoHandler(e) {
      try {
         e.preventDefault();

         let url = `${process.env.REACT_APP_BASE_URL}api/product/set-product-details`;

         const response = await fetch(url, {
            method: 'PUT',
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id && data?._id
            },
            body: JSON.stringify({ images })
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
         } else {
            setActionLoading(false);
         }

      } catch (error) {

      }
   }

   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }

   return (
      <div className='py-3 card_default card_description'>
         <h6>Product Photo</h6>
         {msg}
         <form onSubmit={productPhotoHandler}>
            <div className="col-lg-12 mb-3">
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
                           <img style={{ width: "70px", height: "70px" }} key={index} srcSet={img} alt="" />
                        )
                     })
                  }
               </div>
            </div>
            <button className='bt9_edit' type="submit">
               {
                  actionLoading ? <BtnSpinner text={"Saving..."} /> :
                     "Set Image"
               }
            </button>
         </form>
      </div>
   );
};

export default ProductPhotoForm;
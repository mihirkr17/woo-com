import React, { useState } from 'react';
import { useMessage } from '../../../../Hooks/useMessage';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';


const ProductSpecification = ({ required, data, formTypes, super_category }) => {
   const specs = data?.specification && data?.specification;

   // others necessary states
   const { msg, setMessage } = useMessage();
   const [actionLoading, setActionLoading] = useState(false);

   async function productHandler(e) {
      try {
         e.preventDefault();

         let formData = new FormData(e.currentTarget);

         formData = Object.fromEntries(formData.entries());

         const notEmpty = Object.values(formData).every(x => x !== null && x !== '');

         if (!notEmpty) {
            return setMessage("Required all fields!!!", 'danger');
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/set-product-variation?formType=${formTypes}&attr=ProductSpecs`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id && data?._id
            },
            body: JSON.stringify(formData)
         });

         const resData = await response.json();
         setActionLoading(false);

         setMessage(resData?.message, 'success');
      } catch (error) {
         setMessage(error?.message, 'danger')
      }

   }


   function cSl(spec, existSpecs = {}) {

      let attObject = Object.entries(spec);

      let str = [];

      for (let [key, value] of attObject) {

         str.push(
            (Array.isArray(value) && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required}&nbsp;{key.replace(/_+/gi, " ").toUpperCase()}</label>
               <select name={key} id={key} className='form-select form-select-sm'>


                  {
                     existSpecs.hasOwnProperty(key) && <option value={existSpecs[key]}>{existSpecs[key]}</option>
                  }

                  <option value="">Select {key.replace(/_+/gi, " ")}</option>
                  {
                     value && value.map((type, index) => {
                        return (<option key={index} value={type}>{type}</option>)
                     })
                  }
               </select>
            </div>

            ), typeof value !== 'object' && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required} {key.replace(/_+/gi, " ").toUpperCase()}</label>
               <input type="text" name={key} id={key} placeholder={"Write " + key.replace(/_+/gi, " ")} defaultValue={existSpecs.hasOwnProperty(key) ? existSpecs[key] : ""} className='form-control form-control-sm' />
            </div>

         )
      }

      return str;
   }

   return (
      <form onSubmit={productHandler}>
         <div className="row">
            {

               cSl(super_category?.specification, specs)

            }

            <div className="col-lg-12">
               {msg}
               <button className='bt9_edit' type="submit">
                  {
                     actionLoading ? <BtnSpinner text={"Saving..."} /> :
                        'Save Now'
                  }
               </button>
            </div>
         </div>
      </form>
   );
};

export default ProductSpecification;
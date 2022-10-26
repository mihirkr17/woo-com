import React, { useState } from 'react';
import { useMessage } from '../../../../Hooks/useMessage';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { newCategory } from '../../../../Assets/CustomData/categories';


const VariationFormTwo = ({ required, data, formTypes, super_category }) => {
   const variations = data.variations && data?.variations;

   // others necessary states
   const { msg, setMessage } = useMessage();
   const [actionLoading, setActionLoading] = useState(false);

   async function productHandler(e) {
      try {
         e.preventDefault();
         let formData = new FormData(e.currentTarget);


         formData = Object.fromEntries(formData.entries());
         formData['model'] = e.target.model.value;


         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/set-product-variation?formType=${formTypes}&vId=${variations?.vId || ""}&attr=variationTwo`, {
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

   return (
      <form onSubmit={productHandler}>
         <div className="row">

            <div className="col-lg-3 mb-3">
               <label htmlFor="model">{required} Model Name</label>
               <input type="text" name='model' id='model' placeholder='Model Name' defaultValue={variations?.attributes?.model} className='form-control form-control-sm' />
            </div>

            {
               super_category?.attribute?.types && <div className="col-lg-3 mb-3">
                  <label htmlFor="pType">Type</label>
                  <select name="pType" id="pType" className='form-select form-select-sm'>
                     <option value={variations?.attributes?.pType}>{variations?.attributes?.pType}</option>
                     <option value="">Select Type</option>
                     {
                        super_category?.attribute?.types.map((type, index) => {
                           return (<option key={index} value={type}>{type}</option>)
                        })
                     }
                  </select>
               </div>
            }

            {/* Size attributes */}
            {
               (super_category?.attribute?.sizes) && <div className="col-lg-3 mb-3">
                  <label htmlFor="size">{required} Size</label>
                  <select name="size" id="size" className='form-select form-select-sm'>
                     <option value={variations?.attributes?.size}>{variations?.attributes?.size}</option>
                     <option value="">Select Size</option>
                     {
                        super_category?.attribute?.sizes.map((size, i) => {
                           return (
                              <option key={i} value={size}>{size}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.patterns) && <div className="col-lg-3 mb-3">
                  <label htmlFor="pattern">{required} Patterns</label>
                  <select name="pattern" id="pattern" className='form-select form-select-sm'>
                     <option value={variations?.attributes?.pattern}>{variations?.attributes?.pattern}</option>
                     <option value="">Patterns</option>
                     {
                        super_category?.attribute?.patterns.map((pattern, i) => {
                           return (
                              <option key={i} value={pattern}>{pattern}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.colors) && <div className="col-lg-3 mb-3">
                  <label htmlFor="color">{required} Product Color</label>
                  <select name="color" id="color" className='form-select form-select-sm'>
                     <option value={variations?.attributes?.color}>{variations?.attributes?.color}</option>
                     <option value="">Select Brand Color</option>
                     {
                        super_category?.attribute?.colors.map((color, i) => {
                           return (
                              <option key={i} value={color?.name}>{color?.name}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.fabrics) && <div className="col-lg-3 mb-3">
                  <label htmlFor="fabric">{required} Fabrics</label>
                  <select name="fabric" id="fabric" className='form-select form-select-sm'>
                     <option value={variations?.attributes?.fabric}>{variations?.attributes?.fabric}</option>
                     <option value="">Select Fabrics</option>
                     {
                        super_category?.attribute?.fabrics.map((fabric, i) => {
                           return (
                              <option key={i} value={fabric}>{fabric}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }
            {
               (super_category?.attribute?.idealFor) && <div className="col-lg-3 mb-3">
                  <label htmlFor="idealFor">{required} Ideal For</label>
                  <select name="idealFor" id="idealFor" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.idealFor}>{variations?.attributes?.idealFor}</option>
                     <option value="">Select IdealFor</option>
                     {
                        super_category?.attribute?.idealFor.map((idealFor, i) => {
                           return (
                              <option key={i} value={idealFor}>{idealFor}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.sleeve) && <div className="col-lg-3 mb-3">
                  <label htmlFor="sleeve">{required} Sleeve</label>
                  <select name="sleeve" id="sleeve" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.sleeve}>{variations?.attributes?.sleeve}</option>
                     <option value="">Select sleeve</option>
                     {
                        super_category?.attribute?.sleeve.map((sleeve, i) => {
                           return (
                              <option key={i} value={sleeve}>{sleeve}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.fabricCares) && <div className="col-lg-3 mb-3">
                  <label htmlFor="fabricCare">{required} Fabric Cares</label>
                  <select name="fabricCare" id="fabricCare" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.fabricCare}>{variations?.attributes?.fabricCare}</option>
                     <option value="">Select fabricCares</option>
                     {
                        super_category?.attribute?.fabricCares.map((fabricCare, i) => {
                           return (
                              <option key={i} value={fabricCare}>{fabricCare}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.fit) && <div className="col-lg-3 mb-3">
                  <label htmlFor="fit">{required} Fit</label>
                  <select name="fit" id="fit" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.fit}>{variations?.attributes?.fit}</option>
                     <option value="">Select fit</option>
                     {
                        super_category?.attribute?.fit.map((fit, i) => {
                           return (
                              <option key={i} value={fit}>{fit}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.suiteFor) && <div className="col-lg-3 mb-3">
                  <label htmlFor="suiteFor">{required} Suite For</label>
                  <select name="suiteFor" id="suiteFor" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.suiteFor}>{variations?.attributes?.suiteFor}</option>
                     <option value="">Select suiteFor</option>
                     {
                        super_category?.attribute?.suiteFor.map((suiteFor, i) => {
                           return (
                              <option key={i} value={suiteFor}>{suiteFor}</option>
                           )
                        })
                     }
                  </select>
               </div>
            }

            {
               (super_category?.attribute?.sportType) && <div className="col-lg-3 mb-3">
                  <label htmlFor="sportType">{required} Sports Type</label>
                  <select name="sportType" id="sportType" className='form-select form-select-sm'>
                  <option value={variations?.attributes?.sportType}>{variations?.attributes?.sportType}</option>
                     <option value="">Select Sport Type</option>
                     {
                        super_category?.attribute?.sportType.map((sportType, i) => {
                           return (
                              <option key={i} value={sportType}>{sportType}</option>
                           )
                        })
                     }
                  </select>
               </div>
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

export default VariationFormTwo;
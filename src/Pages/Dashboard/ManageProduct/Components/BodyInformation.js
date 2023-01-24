import React, { useState } from 'react';
import { useMessage } from '../../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';

const BodyInformation = ({ required, data, formTypes }) => {
   const variations = data.variations && data?.variations;

   const { msg, setMessage } = useMessage();
   // Description states
   const [description, setDescription] = useState((data?.bodyInfo?.description && data?.bodyInfo?.description) || "CKEditor v5");


   // search keywords
   const [searchKeywords, setSearchKeywords] = useState((data?.bodyInfo?.searchKeywords && data?.bodyInfo?.searchKeywords) || ['']);

   // key features 
   const [keyFeatures, setKeyFeatures] = useState((data?.bodyInfo?.searchKeywords && data?.bodyInfo?.keyFeatures) || [""]);

   const [actionLoading, setActionLoading] = useState(false);

   // keyword action
   const searchKeywordInputHandler = (e, index) => {
      const { value } = e.target;
      let list = [...searchKeywords];
      list[index] = value;
      setSearchKeywords(list);
   }

   const removeSearchKeywordInputHandler = (i) => {
      let list = [...searchKeywords];
      list.splice(i, 1);
      setSearchKeywords(list);
   }

   // handle key features
   const handleKeyFeaturesInput = (e, index) => {
      const { value } = e.target;

      let list = [...keyFeatures];
      list[index] = value;

      setKeyFeatures(list);
   }

   const removeKeyFeaturesInputHandler = (index) => {
      let list = [...keyFeatures]
      list.splice(index, 1);

      setKeyFeatures(list);
   }


   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }

   async function productBodyInfoHandler(e) {
      try {
         e.preventDefault();
         let metaDescription = e.target.metaDescription.value;

         let bodyInfo = {
            keyFeatures,
            searchKeywords,
            metaDescription,
            description
         }


         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/set-product-variation?formType=${formTypes}&vId=${variations?.vId || ""}&attr=bodyInformation`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: data?._id && data?._id
            },
            body: JSON.stringify(bodyInfo)
         });

         const resData = await response.json();
         setActionLoading(false);

         setMessage(resData?.message, 'success');
      } catch (error) {
         setMessage(error?.message, 'danger')
      }

   }

   return (
      <form onSubmit={productBodyInfoHandler}>
         <div className="row">
            <div className='col-lg-12 my-2'>
               <label htmlFor='searchKeyword'>{required} Search Keywords</label>
               {
                  searchKeywords && searchKeywords.map((keys, i) => {
                     return (
                        <div className='py-2 d-flex align-items-end justify-content-start' key={i}>
                           <input
                              className='form-control form-control-sm'
                              name="searchKeyword" id='searchKeyword'
                              value={keys} type="text"
                              placeholder="Search Keywords"
                              onChange={(e) => searchKeywordInputHandler(e, i)}
                           />

                           {
                              searchKeywords.length !== 1 && <span style={btnStyle}
                                 onClick={() => removeSearchKeywordInputHandler(i)}>
                                 <FontAwesomeIcon icon={faMinusSquare} />
                              </span>
                           }
                           {
                              searchKeywords.length - 1 === i && <span style={btnStyle}
                                 onClick={() => setSearchKeywords([...searchKeywords, ''])}>
                                 <FontAwesomeIcon icon={faPlusSquare} />
                              </span>

                           }
                        </div>
                     )
                  })
               }
            </div>

            <div className="col-lg-12 my-2">
               <label htmlFor='keyFeatures'>{required} Key Features&nbsp;</label>
               {
                  keyFeatures && keyFeatures.map((keys, i) => {
                     return (
                        <div className='py-2 d-flex align-items-end justify-content-start' key={i}>
                           <input
                              className='form-control form-control-sm'
                              name="keyFeatures" id='keyFeatures'
                              value={keys} type="text"
                              placeholder="Key Features"
                              onChange={(e) => handleKeyFeaturesInput(e, i)}
                           />

                           {
                              keyFeatures.length !== 1 && <span style={btnStyle}
                                 onClick={() => removeKeyFeaturesInputHandler(i)}>
                                 <FontAwesomeIcon icon={faMinusSquare} />
                              </span>
                           }
                           {
                              keyFeatures.length - 1 === i && <span style={btnStyle}
                                 onClick={() => setKeyFeatures([...keyFeatures, ''])}>
                                 <FontAwesomeIcon icon={faPlusSquare} />
                              </span>

                           }
                        </div>
                     )
                  })
               }
            </div>

            <div className='col-lg-12 my-2'>
               <label htmlFor='metaDescription'>{required} Meta Description</label>
               <textarea className='form-control'
                  name="metaDescription"
                  id='metaDescription'
                  defaultValue={data?.bodyInfo?.metaDescription || ""} type="text"
                  placeholder="Meta description"></textarea>
            </div>

            <div className="col-lg-12 my-2">
               <label htmlFor='description'>Description</label>
               <CKEditor editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                     const data = editor.getData();
                     return setDescription(data);
                  }}
               />
            </div>

            <div className="col-lg-12 my-2">
               {msg}
               <button className='bt9_edit' type="submit">
                  {
                     actionLoading ? <BtnSpinner text={"Saving..."} /> :
                        'Save Additional Details'
                  }
               </button>
            </div>

         </div>
      </form>
   );
};

export default BodyInformation;
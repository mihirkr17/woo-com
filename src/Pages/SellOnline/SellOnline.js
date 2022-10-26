import React from 'react';
import { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';


const SellOnline = () => {
   const { userInfo, authRefetch } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const [categories, setCategories] = useState({ category: [] });

   const handleChange = (e) => {
      const { value, checked } = e.target;
      const { category } = categories;
      if (checked) {
         setCategories({
            category: [...category, value],
         });
      } else {
         setCategories({
            category: category.filter((e) => e !== value)
         });
      }
   }

   async function handleSellerRequest(e) {
      e.preventDefault();
      let formData = new FormData(e.currentTarget);

      formData = Object.fromEntries(formData.entries());
      formData['categories'] = categories.category;


      if (window.confirm("Submit the form ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/make-seller-request`, {
            method: "PUT",
            withCredential: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
         });

         const resData = await response.json();

         if (!response.ok) {
            return setMessage(resData?.error, 'danger');
         }

         setMessage(resData?.message, 'success');
         authRefetch();
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <h6>Want to sell your product online ? </h6>
            {
               userInfo && (userInfo?.isSeller === "pending") &&
               <p className='text-success'>Your request is under pending...</p>
            }

            {
               <div className="row">

                  <div className="col-lg-7 mx-auto py-5">
                     {msg}

                     {
                        (userInfo?.isSeller === "pending") ? <p className='text-success'>We are looking for your request as soon as possible.</p> :
                           userInfo?.isSeller === "fulfilled" ? <p className='text-success'>You are a SELLER</p> :
                              <form onSubmit={handleSellerRequest} encType='multipart/form-data'>
                                 <small><strong>Be a Seller ? Add your information below...</strong></small>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='taxID' placeholder='Tax ID' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='stateTaxID' placeholder='State Tax ID' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='creditCard' placeholder='Credit Card details' />
                                 </div>
                                 <div className="my-3">
                                    <input type="date" className="form-control" name='dateOfBirth' placeholder='Type city' />
                                 </div>

                                 <div className="my-3">
                                    <input type="text" className="form-control" name='street' placeholder='Street name' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='thana' placeholder='Thana name' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='district' placeholder='Type district name' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='state' placeholder='Type state name' />
                                 </div>
                                 <div className="my-3">
                                    <input type="text" className="form-control" name='country' placeholder='Type country name' />
                                 </div>

                                 <div className="my-3">
                                    <input type="number" className="form-control" name='phone' placeholder='Phone number' />
                                 </div>
                                 <div className="my-3">
                                    <input type="number" className="form-control" name='pinCode' placeholder='Type pinCode' />
                                 </div>

                                 <div className='my-3'>
                                    <small><strong>Please select at least one particular product category for sell...</strong></small>
                                    <div className="row">
                                       <div className="col-12">
                                          <label htmlFor="fashion">
                                             <input type="checkbox" className='me-3' name="fashion" id="fashion" value="fashion" onChange={handleChange} />
                                             Fashion
                                          </label>
                                       </div>
                                       <div className="col-12">
                                          <label htmlFor="electronics">
                                             <input type="checkbox" className='me-3' name="electronics" id="electronics" value="electronics" onChange={handleChange} />
                                             Electronics
                                          </label>
                                       </div>
                                       <div className="col-12">
                                          <label htmlFor="men-clothing">
                                             <input type="checkbox" className='me-3' name="men-clothing" id="men-clothing" value="men-clothing" onChange={handleChange} />
                                             Men Clothing
                                          </label>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="card_default my-3">
                                    <div className="card_description">
                                       <p>
                                          <small className="text-muted">
                                             NB. If you want to become seller your role will be changed to seller and your existing cart & order
                                             information will be deleted from this account. <br />
                                             So we recommended to you, create new account first and become seller.
                                          </small>
                                       </p>
                                    </div>
                                 </div>

                                 <button type='submit' className='btn btn-sm btn-primary'>Submit</button>
                              </form>
                     }
                  </div>
               </div>
            }
         </div>
      </div>
   );
};

export default SellOnline;
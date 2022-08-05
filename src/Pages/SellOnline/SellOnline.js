import React from 'react';
import { useState } from 'react';
import { useAuthUser } from '../../App';
import useAuth from '../../Hooks/useAuth';
import { useMessage } from '../../Hooks/useMessage';


const SellOnline = () => {
   const user = useAuthUser();
   const { userInfo, refetch } = useAuth(user);
   const { msg, setMessage } = useMessage();
   const [categories, setCategories] = useState({ category: [] });

   const apiReq = async (fields) => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/make-seller-request/${user?.email}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(fields)
      });

      if (response.ok) {
         const resData = await response.json();
         return resData;
      }
   }

   const handleSellerPhone = async (e) => {
      e.preventDefault();
      let seller_phone = e.target.seller_phone.value;
    
      let data = await apiReq({ seller_phone });
      if (data?.message === "success") refetch();
   }

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

   const handleSeller = async (e) => {
      e.preventDefault();

      let seller = e.target.seller.value;
      let seller_village = e.target.seller_village.value;
      let seller_district = e.target.seller_district.value;
      let seller_country = e.target.seller_country.value;
      let seller_zip = e.target.seller_zip.value;
      let sell_category = categories?.category;
      let seller_request = "pending";

      let seller_address = { seller_village, seller_district, seller_country, seller_zip };

      if (seller === "" || seller_village === "" || seller_district === "" || seller_country === "" || seller_zip === "" || sell_category.length <= 0) {
         return setMessage(<p className='text-danger'><small><strong>Please fill all input fields !</strong></small></p>);
      }

      if (window.confirm("Submit the form ?")) {
         let data = await apiReq({ seller, sell_category, seller_address, seller_request });

         if (data) {
            setMessage(<p className='text-danger'><small><strong>{data?.message}</strong></small></p>);

            if (data?.message === "success") {
               e.target.reset();
               refetch();
            }
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <h6>Want to sell your product online ? </h6>
            {
               userInfo && (userInfo?.seller_request === "pending") ?
                  <p className='text-success'>Your request is under pending...</p> :
                  <p className='text-success'>Welcome {userInfo?.seller}</p>
            }


            {!userInfo?.seller_phone && <form onSubmit={handleSellerPhone}>
               <div className="row">
                  <div className="col-lg-6">
                     <p>Launch your business in 10 minutes</p>
                     <div className="my-3">
                        <input type="number" className="form-control" name='seller_phone' placeholder='Enter your phone number here' />
                     </div>
                     <button type='submit' className='btn btn-sm btn-warning'>Start Selling</button>
                  </div>
               </div>
            </form>}

            {
               (userInfo?.seller_phone && !userInfo?.seller_request) && <div className="row">

                  <div className="col-lg-7 mx-auto py-5">
                     
                     <form onSubmit={handleSeller} >
                        <small><strong>Be a Seller ? Add your information below...</strong></small>
                        <div className="my-3">
                           <input type="text" className="form-control" name='seller' placeholder='Type name for seller' />
                        </div>
                        <div className="my-3">
                           <input type="text" className="form-control" name='seller_village' placeholder='Type village' />
                        </div>
                        <div className="my-3">
                           <input type="text" className="form-control" name='seller_district' placeholder='Type city' />
                        </div>
                        <div className="my-3">
                           <input type="text" className="form-control" name='seller_country' placeholder='Type country' />
                        </div>
                        <div className="my-3">
                           <input type="number" className="form-control" name='seller_zip' placeholder='Type zip' />
                        </div>

                        <div className='my-3'>
                           <small><strong>Please select at least one particular product category for sell...</strong></small>
                           <div className="row">
                              <div className="col-12">
                                 <label htmlFor='men_cloth'>
                                    <input type="checkbox" className='me-3' name="men_cloth" id="men_cloth" value="men's-clothing" onChange={handleChange} />
                                    Men Clothing
                                 </label>
                              </div>
                              <div className="col-12">
                                 <label htmlFor="women_cloth">
                                    <input type="checkbox" className='me-3' name="women_cloth" id="women_cloth" value="women's-clothing" onChange={handleChange} />
                                    Women Clothing
                                 </label>
                              </div>
                              <div className="col-12">
                                 <label htmlFor="jewelry">
                                    <input type="checkbox" className='me-3' name="jewelry" id="jewelry" value="jewelry" onChange={handleChange} />
                                    Jewelry
                                 </label>
                              </div>
                              <div className="col-12">
                                 <label htmlFor="electronics">
                                    <input type="checkbox" className='me-3' name="electronics" id="electronics" value="electronics" onChange={handleChange} />
                                    Electronics
                                 </label></div>
                           </div>
                        </div>
                        <div className="card my-3">
                           <div className="card-body">
                              <p>
                                 <small className="text-muted">
                                    NB. If you want to become seller your role will be changed to seller and your existing cart & order
                                    information will be deleted from this account. <br />
                                    So we recommended to you, create new account first and become seller.
                                 </small>
                              </p>
                           </div>
                        </div>
                        {msg}
                        <button type='submit' className='btn btn-sm btn-primary'>Submit</button>
                     </form>
                  </div>
               </div>
            }

            {
               userInfo?.seller_request === "pending" && <p>We are looking for your request as soon as possible</p>
            }
            {
               userInfo?.seller_request === "ok" && <p>I am seller now</p>
            }
         </div>
      </div>
   );
};

export default SellOnline;
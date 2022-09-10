import React from 'react';

const AddressForm = ({ setOpenAddressForm, addAddressHandler }) => {
   return (
      <div className="address_edit_form">
         <div className="d-flex align-items-center justify-content-between flex-wrap py-2">
            <strong>Add Shipping Address</strong>
            <button className='badge bg-danger' onClick={() => setOpenAddressForm(false)}>Cancel</button>
         </div>

         <form onSubmit={addAddressHandler}>
            <div className="row">
               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="name">Name</label>
                     <input type="text" className='form-control form-control-sm' name='name' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="address">Village</label>
                     <input type="text" className='form-control form-control-sm' name='village' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="city">City</label>
                     <input type="text" className='form-control form-control-sm' name='city' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="country">Country</label>
                     <input type="text" className='form-control form-control-sm' name='country' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="zip">Zip</label>
                     <input type="text" className='form-control form-control-sm' name='zip' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="phone">Phone</label>
                     <input type="number" className='form-control form-control-sm' name='phone' required />
                  </div>
               </div>

            </div>
            <div className="form-group my-1">
               <button className='btn btn-primary btn-sm' type='submit'>Add Address</button>
            </div>
         </form>
      </div>
   );
};

export default AddressForm;
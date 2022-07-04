import React from 'react';

const AddressUpdateForm = ({ setOpenAddressUpdateForm, updateAddressHandler, addr }) => {
   return (
      <div className="address_edit_form">
         <button className='badge bg-danger' onClick={() => setOpenAddressUpdateForm(false)}>Cancel Update</button>
         <form onSubmit={updateAddressHandler}>
            <div className="form-group my-3">
               <label htmlFor="name">Name</label>
               <input type="text" defaultValue={addr?.name} className='form-control' name='name' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="address">Village</label>
               <input type="text" defaultValue={addr?.village} className='form-control' name='village' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="city">City</label>
               <input type="text" defaultValue={addr?.city} className='form-control' name='city' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="country">Country</label>
               <input type="text" defaultValue={addr?.country} className='form-control' name='country' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="zip">Zip</label>
               <input type="text" defaultValue={addr?.zip} className='form-control' name='zip' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="phone">Phone</label>
               <input type="number" defaultValue={addr?.phone} className='form-control' name='phone' required />
            </div>
            <div className="form-group my-3">
               <button className='btn btn-primary btn-sm' type='submit'>Save Changes</button>
            </div>
         </form>
      </div>
   );
};

export default AddressUpdateForm;
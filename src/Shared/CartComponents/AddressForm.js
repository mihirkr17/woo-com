import React from 'react';

const AddressForm = ({ setOpenAddressForm, addAddressHandler }) => {
   return (
      <div className="address_edit_form">
         <button className='badge bg-danger' onClick={() => setOpenAddressForm(false)}>Cancel</button>
         <form onSubmit={addAddressHandler}>
            <div className="form-group my-3">
               <label htmlFor="name">Name</label>
               <input type="text" className='form-control' name='name' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="address">Village</label>
               <input type="text" className='form-control' name='village' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="city">City</label>
               <input type="text" className='form-control' name='city' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="country">Country</label>
               <input type="text" className='form-control' name='country' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="zip">Zip</label>
               <input type="text" className='form-control' name='zip' required />
            </div>
            <div className="form-group my-3">
               <label htmlFor="phone">Phone</label>
               <input type="number" className='form-control' name='phone' required />
            </div>
            <div className="form-group my-3">
               <button className='btn btn-primary btn-sm' type='submit'>Add Address</button>
            </div>
         </form>
      </div>
   );
};

export default AddressForm;
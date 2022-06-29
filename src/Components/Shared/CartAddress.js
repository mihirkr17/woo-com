import { faCheckDouble, faTriangleExclamation, faPlus, faPenAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useBASE_URL } from '../../lib/BaseUrlProvider';

const CartAddress = ({ refetch, addr, user, step, setStep }) => {
   const BASE_URL = useBASE_URL();

   const addAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let village = e.target.village.value;
      let city = e.target.city.value;
      let country = e.target.country.value;
      let phone = e.target.phone.value;
      let zip = e.target.zip.value;

      let final = { name, village, city, country, phone, zip };
      final["select_address"] = false;

      const response = await fetch(`${BASE_URL}add-address/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      if (response.ok) await response.json(); setStep(false); refetch();
   }

   const selectAddress = async (selectAddress) => {
      let select_address = selectAddress === true ? false : true;

      const response = await fetch(`${BASE_URL}select-address/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ select_address })
      });

      if (response.ok) await response.json(); refetch();
   }

   const removeAddressHandler = async () => {
      if (window.confirm("Want to remove address ?")) {
         const response = await fetch(`${BASE_URL}delete-address/${user?.email}`, {
            method: "DELETE"
         });
         if (response.ok) return await response.json() && refetch();
      }
   }

   return (
      <div className="card_default">
         <div className="card_description">
            <div className="row">
               <div className="col-lg-1"><span>2</span></div>
               <div className="col-lg-11">
                  <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                     <div className={`badge bg-${addr?.select_address === true ? 'success' : 'danger'}`}>
                        Delivery Address
                        {
                           addr?.select_address === true ?
                              <>&nbsp;<FontAwesomeIcon icon={faCheckDouble} /></> :
                              <>&nbsp;<FontAwesomeIcon icon={faTriangleExclamation} /></>
                        }
                     </div>

                     <button onClick={removeAddressHandler} className={`ms-2 badge bg-danger ${step === true ? 'd-none' : ''}`}><FontAwesomeIcon icon={faClose}></FontAwesomeIcon></button>
                     <button className='badge bg-primary'
                        style={step === false ? { display: "block" } : { display: "none" }}
                        onClick={() => setStep(true)}>
                        {addr ? <FontAwesomeIcon icon={faPenAlt} /> : <FontAwesomeIcon icon={faPlus} />}
                     </button>
                  </div>
                  <div className="py-2">
                     <address>
                        {
                           addr ? <p style={{ wordBreak: "break-word" }} className={`${addr?.select_address === true ? '' : 'text-muted'}`}>
                              <small>Customer Name : {addr?.name}</small><br />
                              <small>Village : {addr?.village}</small> <br />
                              <small>City : {addr?.city}</small> <br />
                              <small>Country : {addr?.country}</small> <br />
                              <small>Phone : {addr?.phone}</small> <br />
                              <small>Zip : {addr?.zip}</small>
                           </p> : <p>Please Insert Address</p>
                        }
                        <div className="d-flex align-items-center justify-content-end">
                           {
                              addr && <button className='btn btn-warning btn-sm'
                                 onClick={() => selectAddress(addr?.select_address)} style={step === false ? { display: "block" } : { display: "none" }}>
                                 {addr?.select_address === true ? "Selected" : "Deliver Here"}
                              </button>
                           }

                        </div>
                     </address>
                  </div>

                  <div style={step === true ? { display: "block" } : { display: "none" }} className="address_edit_form">
                     <button className='btn btn-danger btn-sm' onClick={() => setStep(false)}>Cancel</button>
                     <form onSubmit={addAddressHandler}>
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
                           <button className='btn btn-primary btn-sm' type='submit'>Save And Deliver Here</button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartAddress;
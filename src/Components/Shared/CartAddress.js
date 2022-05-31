import { faCheckDouble, faTriangleExclamation, faPlus, faPenAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const CartAddress = ({ refetch, addr, user }) => {
   const [step, setStep] = useState(false);

   const addAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let address = e.target.address.value;
      let city = e.target.city.value;
      let phone = e.target.phone.value;
      let zip = e.target.zip.value;

      let final = { name, address, city, phone, zip };
      final["select_address"] = false;
      final["address_id"] = Math.floor(Math.random() * 1000000000);


      const response = await fetch(`http://localhost:5000/add-address/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      if (response.ok) {
         const resData = await response.json();

         if (resData) {
            setStep(false);
            refetch();
         }
      }
   }

   const selectAddress = async (selectAddress) => {
      let select_address;
      if (selectAddress === true) {
         select_address = false;
      } else {
         select_address = true;
      }

      const response = await fetch(`http://localhost:5000/select-address/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ select_address })
      });

      if (response.ok) {
         const resData = await response.json();

         if (resData) {
            refetch();
         }
      }
   }

   const removeAddressHandler = async (addressId) => {
      const response = await fetch(`http://localhost:5000/delete-address/${user?.email}`, {
         method: "DELETE"
      });

      if (response.ok) {
         const resData = await response.json();
         if (resData) {
            refetch();
         }
      }
   }
   return (
      <div className="card_default">
         <div className="card_description">
            <div className="row">
               <div className="col-lg-1"><span>2</span></div>
               <div className="col-lg-8">
                  <div className={`badge bg-${addr?.select_address === true ? 'success' : 'danger'}`}>
                     Delivery Address
                     {
                        addr?.select_address === true ?
                           <>&nbsp;<FontAwesomeIcon icon={faCheckDouble} /></> :
                           <>&nbsp;<FontAwesomeIcon icon={faTriangleExclamation} /></>
                     }
                  </div>

                  <span onClick={() => removeAddressHandler(addr?.address_id)} className='ms-2 badge bg-danger'><FontAwesomeIcon icon={faClose}></FontAwesomeIcon></span>

                  <div className="py-2">
                     <address>
                        {
                           addr ? <p className={`${addr?.select_address === true ? '' : 'text-muted'}`}>
                              {addr?.name} <br /> {addr?.address},&nbsp;{addr?.city},&nbsp;{addr?.phone},&nbsp;{addr?.zip}
                           </p> : <p>Please Insert Address</p>
                        }
                        <div className="d-flex align-items-center justify-content-end">
                           {
                              addr ? <button className='btn btn-warning btn-sm'
                                 // disabled={addr.select_address === true ? true : false}
                                 onClick={() => selectAddress(addr?.select_address)} style={step === false ? { display: "block" } : { display: "none" }}>
                                 {addr?.select_address === true ? "Selected" : "Deliver Here"}
                              </button> : ''
                           }
                           <button className='btn btn-primary btn-sm ms-2'
                              style={step === false ? { display: "block" } : { display: "none" }}
                              onClick={() => setStep(true)}>
                              {addr ? <FontAwesomeIcon icon={faPenAlt} /> : <FontAwesomeIcon icon={faPlus} />}
                           </button>
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
                           <label htmlFor="address">Address</label>
                           <input type="text" defaultValue={addr?.address} className='form-control' name='address' required />
                        </div>
                        <div className="form-group my-3">
                           <label htmlFor="city">City</label>
                           <input type="text" defaultValue={addr?.city} className='form-control' name='city' required />
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
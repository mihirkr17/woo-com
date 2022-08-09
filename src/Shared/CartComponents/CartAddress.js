import { faCheckCircle, faPlus, faPenAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { loggedOut } from '../common';
import AddressForm from './AddressForm';
import AddressUpdateForm from './AddressUpdateForm';

const CartAddress = ({ refetch, addr, setStep, navigate }) => {

   const [openAddressForm, setOpenAddressForm] = useState(false);
   const [openAddressUpdateForm, setOpenAddressUpdateForm] = useState(false);

   useEffect(() => {
      const selectAddress = addr && addr.map(a => a?.select_address);
      if (selectAddress.includes(true)) {
         setStep(true)
      } else {
         setStep(false)
      }
   }, [addr, setStep]);

   const addAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let village = e.target.village.value;
      let city = e.target.city.value;
      let country = e.target.country.value;
      let phone = e.target.phone.value;
      let zip = e.target.zip.value;
      let addressId = Math.floor(Math.random() * 100000000)

      let final = { addressId, name, village, city, country, phone, zip };
      final["select_address"] = false;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/add-cart-address`, {
         method: "POST",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      const resData = await response.json();

      if (response.ok) {
         setStep(false); refetch()
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      };
   }

   const updateAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let village = e.target.village.value;
      let city = e.target.city.value;
      let country = e.target.country.value;
      let phone = e.target.phone.value;
      let zip = e.target.zip.value;
      let final = { addressId: parseInt(openAddressUpdateForm?.addressId), name, village, city, country, phone, zip };
      final["select_address"] = false;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/update-cart-address`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      const resData = await response.json();

      if (response.ok) { setStep(false); refetch() } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      };
   }

   const selectAddressHandler = async (addressId, selectAddress) => {
      let select_address = selectAddress === true ? false : true;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/select-address`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ addressId, select_address })
      });

      const resData = await response.json();

      if (response.ok) {
         refetch()
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      }
   }

   const deleteAddressHandler = async (addressId) => {
      if (window.confirm("Want to remove address ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/delete-cart-address/${addressId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include"
         });
         const resData = await response.json();

         if (response.ok) { refetch() } else {
            await loggedOut();
            navigate(`/login?err=${resData?.message} token not found`);
         }
      }
   }

   return (
      <div className="cart_card">
         <div className="row">
            <div className="col-lg-12">
               <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                  <h6 className=''>Delivery Address</h6>
                  <button onClick={() => setOpenAddressForm(true)} title="Add New Address" className="ms-2 badge bg-primary">
                     <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                  </button>

               </div>
               <hr />
               <div className="py-2">
                  <div className="row">
                     {
                        addr && addr.map(address => {
                           const { addressId, select_address, name, village, city, country, phone, zip } = address;

                           return (
                              <div className="col-lg-6" key={addressId}>
                                 <div className="row">
                                    <div className="col-10">
                                       <address title={select_address ? "Selected" : 'Select This Address'} onClick={() => selectAddressHandler(addressId, select_address)}>
                                          <div className={`address_card ${select_address ? "selected" : ""}`}>
                                             {
                                                <div style={{ wordBreak: "break-word" }} className={`${select_address ? '' : 'text-muted'}`}>
                                                   <small><b className='me-3'>{name}</b>{select_address && <FontAwesomeIcon icon={faCheckCircle} />}</small>
                                                   <p>
                                                      <small>{village}, {city}, {country}, {zip}</small> <br />
                                                      <small>Phone : {phone}</small>
                                                   </p>
                                                </div>
                                             }
                                          </div>
                                       </address>
                                    </div>
                                    <div className="col-2 d-flex align-items-center flex-column justify-content-center">
                                       <button className='btn btn-sm'
                                          style={openAddressUpdateForm === false ? { display: "block" } : { display: "none" }}
                                          onClick={() => setOpenAddressUpdateForm(true && address)}>
                                          {address && <FontAwesomeIcon icon={faPenAlt} />}
                                       </button>
                                       <button onClick={() => deleteAddressHandler(addressId)} className="btn btn-sm mt-3"><FontAwesomeIcon icon={faClose}></FontAwesomeIcon></button>
                                    </div>
                                 </div>
                              </div>

                           )
                        })

                     }
                     {
                        addr.length === 0 && <>
                           <button onClick={() => setOpenAddressForm(true)} title="Insert Your Address" className="btn mb-3">
                              Insert Your Address
                           </button>
                        </>
                     }
                  </div>
                  {
                     openAddressForm === true ?
                        <AddressForm
                           setOpenAddressForm={setOpenAddressForm}
                           addAddressHandler={addAddressHandler}
                        />
                        : ""
                  }
                  {
                     openAddressUpdateForm ?
                        <AddressUpdateForm
                           setOpenAddressUpdateForm={setOpenAddressUpdateForm}
                           addr={openAddressUpdateForm}
                           updateAddressHandler={updateAddressHandler} /> :
                        ""
                  }
               </div>
            </div>
         </div>

      </div>
   );
};

export default CartAddress;
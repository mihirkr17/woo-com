import { faCheckCircle, faPlus, faPenAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { apiHandler, authLogout } from '../common';
import AddressForm from './AddressForm';
import AddressUpdateForm from './AddressUpdateForm';

const CartAddress = ({ authRefetch, addr, setStep, navigate, setMessage }) => {
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
      let street = e.target.street.value;
      let district = e.target.district.value;
      let state = e.target.state.value;
      let country = e.target.country.value;
      let phoneNumber = e.target.phoneNumber.value;
      let altPhoneNumber = e.target.altPhoneNumber.value;
      let pinCode = e.target.pinCode.value;
      let addressId = Math.floor(Math.random() * 100000000)

      let final = { addressId, name, street, district, state, country, phoneNumber, altPhoneNumber, pinCode };
      final["select_address"] = false;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/cart/add-cart-address`, {
         method: "POST",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      const resData = await response.json();

      if (response.status === 401 || response.status === 403) {
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      }

      if (response.ok) {
         setStep(false);
         setMessage(resData?.message, "success");
         authRefetch();
      }

   }

   const updateAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let street = e.target.street.value;
      let district = e.target.district.value;
      let state = e.target.state.value;
      let country = e.target.country.value;
      let phoneNumber = e.target.phoneNumber.value;
      let altPhoneNumber = e.target.altPhoneNumber.value;
      let pinCode = e.target.pinCode.value;
      let final = { addressId: parseInt(openAddressUpdateForm?.addressId), name, street, district, state, country, phoneNumber, altPhoneNumber, pinCode };
      final["select_address"] = false;

      const resData = await apiHandler(
         `${process.env.REACT_APP_BASE_URL}api/cart/update-cart-address`,
         "PUT",
         null,
         final
      );

      if (resData.status === 401 || resData.status === 403) {
         await authLogout();
         return navigate(`/login?err=${resData?.error}`);
      };

      if (resData.success) {
         setStep(false);
         setMessage(resData?.message, "success");
         authRefetch();
      };
   }

   const selectAddressHandler = async (addressId, selectAddress) => {
      let select_address = selectAddress === true ? false : true;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/cart/select-address`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ addressId, select_address })
      });

      const resData = await response.json();

      if (response.status === 401 || response.status === 403) {
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      };

      if (response.ok) {
         authRefetch();
         setMessage(resData?.message, "success");
      } else {
         setMessage(resData?.error, "warning");
      }
   }

   const deleteAddressHandler = async (addressId) => {
      if (window.confirm("Want to remove address ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/cart/delete-cart-address/${addressId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include"
         });
         const resData = await response.json();

         if (response.status === 401 || response.status === 403) {
            await authLogout();
            navigate(`/login?err=${resData?.error}`);
         };

         if (response.ok) { authRefetch() };
      }
   }

   return (
      <div className="cart_card">
         <div className="row">
            <div className="col-lg-12">
               <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                  <h6 className=''>Shipping Address</h6>
                  <button onClick={() => setOpenAddressForm(true)} title="Add New Address" className="ms-2 badge bg-primary">
                     <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                  </button>

               </div>
               <hr />
               <div className="py-2">
                  <div className="row">
                     {
                        addr && addr.map(address => {
                           const { addressId, select_address, name, street, district, country, phoneNumber, pinCode } = address;

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
                                                      <small>{street}, {district}, {country}, {pinCode}</small> <br />
                                                      <small>Phone : {phoneNumber}</small>
                                                   </p>
                                                </div>
                                             }
                                          </div>
                                       </address>
                                    </div>
                                    <div className="col-2 d-flex align-items-center flex-column justify-content-center">
                                       <button className='btn btn-sm'
                                          style={openAddressUpdateForm === false ? { display: "block" } : { display: "none" }}
                                          onClick={() => setOpenAddressUpdateForm(address)}>
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
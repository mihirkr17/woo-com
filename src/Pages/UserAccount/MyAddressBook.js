import React from 'react';
import { faCheckCircle, faPlus, faPenAlt, faClose, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useState } from 'react';
import { addressBook } from '../../Assets/CustomData/addressBook';
import { useMessage } from '../../Hooks/useMessage';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../lib/AuthProvider';

const MyAddressBook = () => {
   const { authRefetch, userInfo } = useAuthContext();
   const [newShipAddrs, setNewShipAddrs] = useState(false);
   const [oldShipAddrs, setOldShipAddrs] = useState(false);
   const [newDivision, setNewDivision] = useState({});
   const [newCity, setNewCity] = useState({});
   const [address, setAddress] = useState({});
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();
   const addr = userInfo && userInfo?.buyer?.shippingAddress;

   useEffect(() => {
      if (oldShipAddrs) {
         setAddress(oldShipAddrs);
      } else {
         setAddress({
            name: "",
            division: "",
            city: "",
            area: "",
            area_type: "",
            landmark: "",
            phone_number: 0,
            postal_code: 0,
            default_shipping_address: false
         })
      }

   }, [oldShipAddrs]);

   useEffect(() => {
      setNewDivision(Array.isArray(addressBook?.division) && addressBook?.division.find(e => e.name === address?.division));
      setNewCity(Array.isArray(newDivision?.city) && newDivision?.city.find(e => e?.name === address?.city))
   }, [address?.division, address?.city, newDivision?.city]);

   function addressHandler(e) {
      let { name, value } = e.target;
      setAddress({ ...address, [name]: value });
   }

   function closeAddressForm() {
      setNewShipAddrs(false);
      setOldShipAddrs(false);
   }

   const addAddressHandler = async (e) => {
      e.preventDefault();

      if (e.type === "submit") {

         address['area_type'] = newDivision?.area_type || address?.area_type;

         // const isEmpty = Object.values(address).every(e => )

         if (oldShipAddrs?._SA_UID) {
            address['_SA_UID'] = oldShipAddrs?._SA_UID;
         }

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/shipping-address`, {
            method: oldShipAddrs?._SA_UID ? "PUT" : "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(address)
         });

         const resData = await response.json();

         if (response.ok) {
            // setStep(false);
            setMessage(resData?.message, "success");
            authRefetch();
         }
      }
   }

   const selectAddressHandler = async (addressId, selectAddress) => {

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/shipping-address-select`, {
         method: "POST",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ _SA_UID: addressId, default_shipping_address: selectAddress })
      });

      const resData = await response.json();

      if (response.ok) {
         authRefetch();
         setMessage(resData?.message, "success");
      } else {
         setMessage(resData?.error, "warning");
      }
   }

   const deleteAddressHandler = async (addressId) => {
      if (window.confirm("Want to remove address ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/shipping-address-delete/${addressId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include"
         });
         const resData = await response.json();

         if (response.ok) { authRefetch() };
      }
   }
   return (
      <>
         {msg}
         <div className="row">
            <div className="col-lg-12">
               <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                  <h6 className=''>Shipping Address</h6>
                  <button onClick={() => setNewShipAddrs(true)} title="Add New Address" className="bt9_edit ms-2">
                     <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>&nbsp; Add new address
                  </button>

               </div>
               <hr />
               <div className="py-2">
                  {
                     (newShipAddrs || oldShipAddrs) ?
                        <div className="p-1">
                           <form action="" onSubmit={addAddressHandler}>

                              <div className="row">
                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="name">Full Name</label>
                                       <input type="text" value={address?.name || ""} className='form-control form-control-sm' name='name' id='name' required onChange={(e) => addressHandler(e)} />
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="phone_number">Phone Number</label>
                                       <input type="number" value={address?.phone_number || ""} className='form-control form-control-sm' name='phone_number' id='phone_number' required onChange={(e) => addressHandler(e)} />
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="division">Division</label>
                                       <select name="division" className='form-select form-select-sm' id="division" onChange={(e) => addressHandler(e)}>

                                          <option value={address?.division || ""}>{address?.division || "Select Division"}</option>
                                          {
                                             addressBook?.division && addressBook?.division.map((item, index) => {
                                                return (
                                                   <option value={item?.name} key={index}>{item?.name}</option>
                                                )
                                             })
                                          }
                                       </select>
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="city">City</label>
                                       <select className='form-select form-select-sm' name="city" id="city" onChange={(e) => addressHandler(e)}>
                                          <option value={address?.city || ""}>{address?.city || "Select City"}</option>
                                          {
                                             Array.isArray(newDivision?.city) && newDivision?.city.map((item, index) => {
                                                return (
                                                   <option key={index} value={item?.name}>{item?.name}</option>
                                                )
                                             })
                                          }
                                       </select>
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="area">Area</label>
                                       <select className='form-select form-select-sm' name="area" id="area" onChange={(e) => addressHandler(e)}>
                                          <option value={address?.area || ""}>{address?.area || "Select Area"}</option>
                                          {
                                             Array.isArray(newCity?.areas) && newCity?.areas.map((ar, ind) => {

                                                return (
                                                   <option key={ind} value={ar}>{ar}</option>
                                                )
                                             })
                                          }
                                       </select>
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="landmark">Landmark</label>
                                       <input value={address?.landmark || ""} type="text"
                                          className='form-control form-control-sm' name='landmark' id='landmark'
                                          required onChange={(e) => addressHandler(e)}
                                          placeholder="e.g: Beside Railway station."
                                       />
                                    </div>
                                 </div>

                                 <div className="col-lg-6">
                                    <div className="form-group my-1">
                                       <label htmlFor="postal_code">Postal Code</label>
                                       <input value={address?.postal_code || ""} type="number"
                                          className='form-control form-control-sm' name='postal_code' id='postal_code' required onChange={(e) => addressHandler(e)} />
                                    </div>
                                 </div>

                                 <div className="form-group my-1">
                                    <button className='bt9_edit me-2' type='submit'>{
                                       oldShipAddrs ? "Edit Address" : "Add Address"
                                    }</button>
                                    {
                                       <span className='bt9_cancel' title='Cancel' onClick={closeAddressForm}>
                                          Cancel
                                       </span>
                                    }
                                 </div>
                              </div>
                           </form>
                        </div> :
                        <div className="row">
                           {
                              addr && addr.map(addrs => {
                                 const { _SA_UID, name, division, city, phone_number, postal_code, landmark, default_shipping_address } = addrs;

                                 return (
                                    <div className="col-lg-6" key={_SA_UID}>
                                       <div className={`row shipping_address_card ${default_shipping_address ? "selected" : ""}`}>
                                          <div className="col-10">
                                             <address title={default_shipping_address ? "Default shipping address." : 'Select as a default shipping address.'} onClick={() => selectAddressHandler(_SA_UID, default_shipping_address)}>
                                                <div className="address_card">
                                                   {
                                                      <div style={{ wordBreak: "break-word" }} className={`${default_shipping_address ? '' : 'text-muted'}`}>
                                                         <small><b className='me-3'>{name}</b>{default_shipping_address && <FontAwesomeIcon icon={faCheckCircle} />}</small>
                                                         <p>
                                                            <small>{division}, {city}, {postal_code}</small> <br />
                                                            <small>{landmark}</small> <br />
                                                            <small>Phone : {phone_number}</small> <br />
                                                            {
                                                               default_shipping_address === true &&
                                                               <span className="badge bg-danger">
                                                                  Default Shipping Address
                                                               </span>
                                                            }
                                                         </p>
                                                      </div>
                                                   }
                                                </div>
                                             </address>
                                          </div>
                                          <div className="col-2 d-flex align-items-center flex-column justify-content-center">


                                             {
                                                (!oldShipAddrs) ?
                                                   <button className='btn btn-sm'
                                                      style={oldShipAddrs === false ? { display: "block" } : { display: "none" }}
                                                      onClick={() => setOldShipAddrs(addrs)}>
                                                      {address && <FontAwesomeIcon icon={faPenAlt} />}
                                                   </button> :
                                                   <button className='btn btn-sm' title='Cancel'>
                                                      {<FontAwesomeIcon icon={faClose} />}
                                                   </button>
                                             }

                                             <button title='Delete this address!' onClick={() => deleteAddressHandler(_SA_UID)} className="btn btn-sm mt-3">
                                                <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                             </button>
                                          </div>
                                       </div>
                                    </div>

                                 )
                              })
                           }
                           {
                              Array.isArray(addr) && addr.length === 0 && <>
                                 <div className="col-12">
                                    <button onClick={() => setNewShipAddrs(true)} title="Insert Your Address" className="btn mb-3">
                                       Insert Your Address
                                    </button>
                                 </div>
                              </>
                           }
                        </div>
                  }

               </div>
            </div>
         </div>
      </>

   );
};

export default MyAddressBook;
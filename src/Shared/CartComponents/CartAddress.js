import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Spinner from '../../Components/Shared/Spinner/Spinner';


const CartAddress = ({ authRefetch, addr, navigate, setMessage }) => {
   const [loading, setLoading] = useState(false);

   const selectAddressHandler = async (addressId, selectAddress) => {
      try {
         setLoading(true);

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/user/shipping-address-select`, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify({ _SA_UID: addressId, default_shipping_address: selectAddress })
         });

         setLoading(false);
         const resData = await response.json();

         if (response.ok) {
            authRefetch();
            setMessage(resData?.message, "success");
         } else {
            setLoading(false);
            setMessage(resData?.error, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }

   if (loading) { return <Spinner /> } else {
      return (
         <div className="py-2">
            <h6 className=''>Shipping Address</h6>
            <hr />
            <div className="row">
               {
                  addr ? addr.map(addrs => {
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
                           </div>
                        </div>

                     )
                  }) : <div className="col-12">
                     <button onClick={() => navigate("/user/my-account/address-book")} title="Insert Your Address" className="btn mb-3">
                        Insert Your Address
                     </button>
                  </div>
               }
            </div>
         </div>
      );
   }
};

export default CartAddress;
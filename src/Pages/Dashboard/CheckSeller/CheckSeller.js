import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from '../../../Components/Shared/Spinner/Spinner';

import { useSellerChecker } from '../../../lib/SellerCheckProvider';

const CheckSeller = () => {
   
   const [modals, setModals] = useState(false);
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { state, dispatch, refetch, loading } = useSellerChecker();
   const data = state?.data;

   if (loading) return <Spinner></Spinner>;

   const makeSellerHandler = async (userId) => {

      if (window.confirm("Make Seller ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/permit-seller-request/${userId}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            }
         });

         const resData = await response.json();

         if (response.ok) {
            resData && refetch();
            setModals(false);
            dispatch({ type: "INIT_CHECKER", payload: { data, slLength: data.length } });
         } else {
            console.log(resData?.message);
         }
      }
   }


   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               {data && data.length > 0 && <table className='table table-responsive'>
                  <thead>
                     <tr>
                        <th>Seller Name</th>
                        <th>Seller Phone</th>
                        <th>Status</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        data.map((user, index) => {
                           return (
                              <tr key={index}>
                                 <td>{user?.seller}</td>
                                 <td>{user?.seller_phone}</td>
                                 <td>{user?.seller_request}</td>
                                 <td>
                                    <button className="btn btn-sm" onClick={() => setModals(true && user)}><FontAwesomeIcon icon={faEye} /></button>
                                 </td>
                              </tr>
                           )
                        })
                     }

                  </tbody>
               </table>
               }
               {
                  data && data.length <= 0 && <p>No seller request found</p>
               }
               <Modal show={modals}>
                  <Modal.Header>
                     <Modal.Title>Seller Information : </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <div className="card_default">
                        <div className="card_description">
                           <small><strong>Seller Name</strong> : {modals?.seller}</small><br />
                           <small><strong>Seller Village</strong> : {modals?.seller_address?.seller_village}</small><br />
                           <small><strong>Seller District</strong> : {modals?.seller_address?.seller_district}</small><br />
                           <small><strong>Seller Country</strong> : {modals?.seller_address?.seller_country}</small><br />
                           <small><strong>Seller Zip Code</strong> : {modals?.seller_address?.seller_zip}</small><br />
                           <small><strong>Seller Phone</strong> : {modals?.seller_phone}</small><br />
                           <small><strong>Seller Request</strong> : {modals?.seller_request}</small><br />
                           <div className="py-3">
                              <button className="btn btn-sm btn-primary me-3" onClick={() => makeSellerHandler(modals?._id)}>Make Seller</button>
                              <button className="btn btn-sm btn-danger">Delete Request</button>
                           </div>
                        </div>
                     </div>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="danger" className="btn-sm" onClick={() => setModals(false)}>
                        Cancel
                     </Button>
                  </Modal.Footer>
               </Modal>
            </div>
         </div>
      </div>
   );
};

export default CheckSeller;
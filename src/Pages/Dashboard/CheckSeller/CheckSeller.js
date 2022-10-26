import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useMessage } from '../../../Hooks/useMessage';

import { useSellerChecker } from '../../../lib/SellerCheckProvider';

const CheckSeller = () => {
   const { msg, setMessage } = useMessage();
   const [modals, setModals] = useState(false);
   // const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');
   const { state, dispatch, refetch, loading } = useSellerChecker();
   const data = state?.data;

   if (loading) return <Spinner></Spinner>;

   const makeSellerHandler = async (userId, userEmail) => {

      if (window.confirm("Make Seller ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/permit-seller-request`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: userId + ',' + userEmail
            }
         });

         const resData = await response.json();

         if (response.ok) {
            refetch();
            setModals(false);
            dispatch({ type: "INIT_CHECKER", payload: { data, slLength: data.length } });
         } else {
            setMessage(resData?.error, 'danger');
         }
      }
   }


   return (
      <div className='section_default'>
         <div className="container">
            {msg}
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
                                 <td>{user?.username}</td>
                                 <td>{user?.sellerInfo?.phone}</td>
                                 <td>{user?.isSeller}</td>
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
                           <small><strong>Seller Name</strong> : {modals?.username}</small><br />
                           <small><strong>Seller Email</strong> : {modals?.email}</small><br />
                           <small><strong>Seller Thana</strong> : {modals?.sellerInfo?.address?.thana}</small><br />
                           <small><strong>Seller District</strong> : {modals?.sellerInfo?.address?.district}</small><br />
                           <small><strong>Seller Country</strong> : {modals?.sellerInfo?.address?.country}</small><br />
                           <small><strong>Seller Zip Code</strong> : {modals?.sellerInfo?.address?.pinCode}</small><br />
                           <small><strong>Seller Phone</strong> : {modals?.sellerInfo?.phone}</small><br />
                           <small><strong>Seller Request</strong> : {modals?.isSeller}</small><br />
                           <div className="py-3">
                              <button className="btn btn-sm btn-primary me-3" onClick={() => makeSellerHandler(modals?._id, modals?.email)}>Make Seller</button>
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
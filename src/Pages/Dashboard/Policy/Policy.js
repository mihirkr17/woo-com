import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import PolicyUpdateFrom from './PolicyUpdateFrom';

const Policy = () => {
   const { data, loading, refetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/v1/policy/privacy-policy`);
   const [show, setShow] = useState(false);
   const [show2, setShow2] = useState(false);
   const [show3, setShow3] = useState(false);
   const [openEditForm, setOpenEditForm] = useState("");


   const handleFormState = (param) => {
      if (param === openEditForm) {
         setOpenEditForm(null)
      } else {
         setOpenEditForm(param)
      }
   }

   if (loading) return <Spinner />
   return (
      <div className='section_default privacy_policy'>
         <div className="container">
            <div className="d-flex align-items-center justify-content-between py-3">
               <h6>Policy About Product</h6>
               <button className='btn btn-sm' onClick={() => handleFormState("edit")}>{openEditForm === "edit" ? "Cancel" : "Edit"}</button>
            </div>

            {
               openEditForm === "edit" ? <PolicyUpdateFrom data={data} refetch={refetch} /> :

                  <div className="row">
                     <div className="col-12 mb-3">
                        <div className="card_default card_description">
                           <p><small><strong>Customer Support Email : </strong> {data?.support_email}</small></p>
                        </div>
                     </div>

                     <div className="col-12 mb-3">
                        <div className="card_default card_description">
                           <h6><strong>Purchase Policy</strong></h6>
                           {
                              data?.purchase_policy && data?.purchase_policy.map((items, index) => (
                                 <li style={{ listStyle: "disc", marginBottom: "0.8rem" }} key={index}>{items}</li>
                              )).slice(0, show ? data?.purchase_policy.length : 3)
                           }
                           <button className='btn btn-sm' onClick={() => setShow(e => !e)}>{show ? "Show Less" : "Show More"}</button>
                        </div>
                     </div>
                     <div className="col-12 mb-3">
                        <div className="card_default card_description">
                           <h6><strong>Refund Policy</strong></h6>
                           <ul>
                              {
                                 data?.refund_policy && data?.refund_policy.map((items, index) => (
                                    <li style={{ listStyle: "disc", marginBottom: "0.8rem" }} key={index}>{items}</li>
                                 )).slice(0, show2 ? data?.refund_policy.length : 3)
                              }
                           </ul>
                           <button className='btn btn-sm' onClick={() => setShow2(e => !e)}>{show2 ? "Show Less" : "Show More"}</button>
                        </div>
                     </div>

                     <div className="col-12 mb-3">
                        <div className="card_default card_description">
                           <h6><strong>Replace Policy</strong></h6>
                           {
                              data?.replace_policy && data?.replace_policy.map((items, index) => (
                                 <li style={{ listStyle: "disc", marginBottom: "0.8rem" }} key={index}>{items}</li>
                              )).slice(0, show3 ? data?.replace_policy.length : 3)
                           }
                           <button className='btn btn-sm' onClick={() => setShow3(e => !e)}>{show3 ? "Show Less" : "Show More"}</button>
                        </div>
                     </div>

                     <div className="col-12 mb-3">
                        <div className="card_default card_description">
                           <h6><strong>Pay Information</strong></h6>
                           <table className='table table-sm'>
                              <thead></thead>
                              <tbody>
                                 {
                                    data?.pay_information && data?.pay_information.map((items, index) => (
                                       <tr key={index}>
                                          <th>{items?.types} :</th>
                                          <td>{items?.values}</td>
                                       </tr>
                                    ))
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
            }
         </div>
      </div>
   );
};

export default Policy;
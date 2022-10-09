import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../../Shared/common';

const PolicyUpdateFrom = ({ data, refetch }) => {
   const navigate = useNavigate();
   //refund state
   const [refundPolicy, setRefundPolicy] = useState(data?.refund_policy || []);

   // replace policy
   const [replacePolicy, setReplacePolicy] = useState(data?.replace_policy || []);

   // purchase state
   const [purchasePolicy, setPurchasePolicy] = useState(data?.purchase_policy || []);

   // payment policy state
   const [paymentInformation, setPaymentInformation] = useState(data?.pay_information || [{ types: "", values: "" }])


   // refund policy action start
   const handleRefundPolicyInputs = (e, index) => {
      const { value } = e.target;
      let list = [...refundPolicy];
      list[index] = value;
      setRefundPolicy(list)
   }

   const addRefundPolicyInputField = () => {
      setRefundPolicy([...refundPolicy, '']);
   }

   const removeRefundPolicyInputField = (index) => {
      let listArr = [...refundPolicy];
      listArr.splice(index, 1);
      setRefundPolicy(listArr);
   }
   // refund policy action end

   // replace policy action start
   const handleReplacePolicyInputs = (e, index) => {
      const { value } = e.target;
      let list = [...replacePolicy];
      list[index] = value;
      setReplacePolicy(list)
   }

   const addReplacePolicyInputField = () => {
      setReplacePolicy([...replacePolicy, '']);
   }

   const removeReplacePolicyInputField = (index) => {
      let listArr = [...replacePolicy];
      listArr.splice(index, 1);
      setReplacePolicy(listArr);
   }
   // replace policy action end

   // purchase policy action start
   const handlePurchasePolicyInputs = (e, index) => {
      const { value } = e.target;
      let list = [...purchasePolicy];
      list[index] = value;
      setPurchasePolicy(list)
   }

   const addPurchasePolicyInputField = () => {
      setPurchasePolicy([...purchasePolicy, '']);
   }

   const removePurchasePolicyInputField = (index) => {
      let listArr = [...purchasePolicy];
      listArr.splice(index, 1);
      setPurchasePolicy(listArr);
   }
   // replace policy action end

   // payment policy
   const addPaymentPolicyInputField = () => {
      setPaymentInformation([...paymentInformation, { types: "", values: "" }])
   }

   // handle input change
   const handlePaymentInputChange = (e, index) => {
      const { name, value } = e.target;
      let list = [...paymentInformation];
      list[index][name] = value;
      setPaymentInformation(list);
   };
   // handle click event of the Remove button
   const removePaymentPolicyInputField = index => {
      const list = [...paymentInformation];
      list.splice(index, 1);
      setPaymentInformation(list);
   };

console.log(paymentInformation);

   const handlePolicy = async (e) => {
      e.preventDefault();
      let policy = {
         replace_policy: replacePolicy, refund_policy: refundPolicy, purchase_policy: purchasePolicy, pay_information : paymentInformation
      }
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/policy/update-policy/${data?._id}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(policy)
      });

      const resData = await response.json();

      if (response.ok) {
         console.log(resData?.message);
         refetch();
      } else {
         await authLogout();
         navigate(`/login?err=${resData?.error}`);
      }

   }

   return (
      <form onSubmit={handlePolicy}>
         <div className="my-4">
            <label>Refund (<small>Policy</small>)&nbsp;
               <button className="badge bg-primary p-2 btn-sm" onClick={addRefundPolicyInputField}>Add New Policy</button>
            </label>
            {
               refundPolicy && refundPolicy.map((x, i) => {
                  return (
                     <div className="py-2 d-flex align-items-end" key={i}>

                        <div className="row w-100">
                           <div className="col-lg-12 mb-3">
                              <input className="form-control form-control-sm" name="pd" id='pd' type="text"
                                 placeholder='Refund Policy' value={x} onChange={(e) => handleRefundPolicyInputs(e, i)}></input>
                           </div>
                        </div>

                        <div className="btn-box d-flex ms-4 mb-3">
                           <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => removeRefundPolicyInputField(i)}>
                              x
                           </button>
                        </div>
                     </div>
                  )
               })
            }
         </div>

         <div className="my-4">
            <label>Replace (<small>Policy</small>)&nbsp;
               <button className="badge bg-primary p-2 btn-sm" onClick={addReplacePolicyInputField}>Add New Replace Policy</button>
            </label>
            {
               replacePolicy && replacePolicy.map((x, i) => {
                  return (
                     <div className="py-2 d-flex align-items-end" key={i}>

                        <div className="row w-100">
                           <div className="col-lg-12 mb-3">
                              <input className="form-control form-control-sm" name="refund_policy" id='refund_policy' type="text"
                                 placeholder='Replace Policy' value={x} onChange={(e) => handleReplacePolicyInputs(e, i)}></input>
                           </div>
                        </div>

                        <div className="btn-box d-flex ms-4 mb-3">
                           <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => removeReplacePolicyInputField(i)}>
                              x
                           </button>
                        </div>
                     </div>
                  )
               })
            }
         </div>

         <div className="my-4">
            <label>Purchase (<small>Policy</small>)&nbsp;
               <button className="badge bg-primary p-2 btn-sm" onClick={addPurchasePolicyInputField}>Add New Purchase Policy</button>
            </label>
            {
               purchasePolicy && purchasePolicy.map((x, i) => {
                  return (
                     <div className="py-2 d-flex align-items-end" key={i}>

                        <div className="row w-100">
                           <div className="col-lg-12 mb-3">
                              <input className="form-control form-control-sm" name="refund_policy" id='refund_policy' type="text"
                                 placeholder='Replace Policy' value={x} onChange={(e) => handlePurchasePolicyInputs(e, i)}></input>
                           </div>
                        </div>

                        <div className="btn-box d-flex ms-4 mb-3">
                           <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => removePurchasePolicyInputField(i)}>
                              x
                           </button>
                        </div>
                     </div>
                  )
               })
            }
         </div>

         <div className="my-4">
            <label>Payment Information (<small>Policy</small>)&nbsp;
            </label>
            {
               paymentInformation && paymentInformation.map((x, i) => {
                  return (
                     <div className="py-2 d-flex align-items-end" key={i}>

                        <div className="row w-100">
                           <div className="col-lg-6 mb-3">

                              <input className="form-control form-control-sm" name="types" id='types' type="text" placeholder='Payment types' value={x.types} onChange={(e) => handlePaymentInputChange(e, i)}></input>
                           </div>

                           <div className="col-lg-6 mb-3">
                              <input className="form-control form-control-sm" name="values" id='values' type="text" placeholder='Payment values' value={x.values} onChange={(e) => handlePaymentInputChange(e, i)}></input>
                           </div>
                        </div>

                        <div className="btn-box d-flex ms-4 mb-3">
                           {paymentInformation.length !== 1 && <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => removePaymentPolicyInputField(i)}>Remove</button>}
                           {paymentInformation.length - 1 === i && <button className="btn btn-primary btn-sm" onClick={addPaymentPolicyInputField}>Add</button>}
                        </div>
                     </div>
                  )
               })
            }
         </div>
         <button type='submit' className="btn btn-sm btn-primary">
            Update
         </button>
      </form>
   );
};

export default PolicyUpdateFrom;
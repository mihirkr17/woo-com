import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import ConfirmDialog from '../../../../Shared/ConfirmDialog';
import OrderPaymentInfoModal from './OrderPaymentInfoModal';

const OrderTable = ({ orderList, cancelOrderHandler, setOpenModal, orderDispatchHandler, setLabelModal, orderRefetch }) => {
   const [openBox, setOpenBox] = useState(false);
   const [openOrderPaymentInfo, setOpenOrderPaymentInfo] = useState(false);
   const [openOption, setOpenOption] = useState(null);
   const [openCancelReasonForm, setOpenCancelReasonForm] = useState(false);

   const optionHandler = (params) => {
      if (params !== openOption) {
         setOpenOption(params);
      } else {
         setOpenOption(null);
      }
   }

   const getPaymentInfo = async (piID, order) => {
      try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/payment/retrieve-payment-intent/${piID}`, {
            method: "GET",
            withCredential: true,
            credentials: "include"
         });

         const result = await response.json();
         result["order"] = order;

         if (response.ok) {
            setOpenOrderPaymentInfo(result);
         }
      } catch (error) {

      }
   }

   const apiHandler = async (body) => {
      try {
         return await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/order-status-management`, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
         });

      } catch (error) {

      }
   }

   const orderCancelHandler = async (e, order) => {
      e.preventDefault();

      if (!order) {
         return;
      }

      let cancelReason = e.target.cancelReason.value || "";

      const { customerEmail, productID, variationID, orderID, listingID, trackingID, quantity } = order;

      const response = await apiHandler({
         type: "canceled",
         customerEmail, productID, variationID, orderID, listingID, trackingID, quantity, cancelReason
      });

      const result = await response.json();

      if (response.ok) {
         orderRefetch();
      }
   }


   return (
      <>
         <Table striped responsive>
            <thead>
               <tr>
                  <th>Order Id</th>
                  <th>Customer Email</th>
                  <th>Payment Mode</th>
                  <th>Payment Status</th>
                  <th>Total Amount</th>
                  <th>Order Status</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {
                  orderList && orderList.map((odr) => {

                     const { orderID, customerEmail, paymentMode, orderStatus, baseAmount, paymentStatus } = odr;
                     return (
                        <tr key={orderID}>

                           <td><span className="text-info">{orderID}</span> </td>
                           <td>{customerEmail}</td>
                           <td>{paymentMode}</td>
                           <td>{paymentStatus}</td>
                           <td>{baseAmount} Tk</td>
                           <td>{orderStatus}</td>

                           <td style={{ position: "relative" }}>
                              <button style={{
                                 border: "none",
                                 padding: "0.4rem",
                                 background: "transparent",
                                 fontSize: "1rem"
                              }} onClick={() => optionHandler(orderID)}>
                                 <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
                              </button>

                              {
                                 (openOption === orderID) &&
                                 <div className='action_buttons'>
                                    <ul>
                                       <li>
                                          <button className='status_btn_alt' onClick={() => getPaymentInfo(odr && odr?.paymentIntentID, odr)}>Get Payment Info</button>
                                       </li>

                                       {
                                          (orderStatus === "canceled") &&
                                          <li>
                                             <button className='status_btn_alt' onClick={() => getPaymentInfo(odr && odr?.paymentIntentID, odr)}>Refund Now</button>
                                          </li>
                                       }
                                       {
                                          (orderStatus === "pending") && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Dispatch Now</button>
                                             </li>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setLabelModal(true && odr)}>Download Label</button>
                                             </li>
                                          </>
                                       }
                                       <li>
                                          <button className="status_btn_alt" onClick={() => setOpenModal(true && odr)}>Details</button>
                                       </li>
                                       {
                                          orderStatus === "dispatch" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Placed Now</button>
                                             </li>
                                          </>
                                       }
                                       {
                                          orderStatus === "placed" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Shipped Now</button>
                                             </li>
                                          </>
                                       }
                                       {
                                          orderStatus === "pending" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Dispatch Now</button>
                                             </li>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenCancelReasonForm((orderID !== openCancelReasonForm) ? orderID : false)}>
                                                   Cancel Now
                                                </button>
                                                {
                                                   (openCancelReasonForm === orderID) &&
                                                   <ul>
                                                      <li>
                                                         <form className="p-1" onSubmit={(e) => orderCancelHandler(e, odr)}>
                                                            <label htmlFor="cancelReason">Choose a Reason</label>
                                                            <select className='form-select form-select-sm mb-2' name="cancelReason" id="cancelReason">
                                                               <option value="customer_want_to_cancel">Customer want to cancel</option>
                                                            </select>
                                                            <button className='bt9_edit'>Submit</button>
                                                         </form>
                                                      </li>
                                                   </ul>
                                                }
                                             </li>
                                          </>
                                       }
                                       {
                                          orderStatus === "shipped" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Completed Now</button>
                                             </li>
                                          </>
                                       }
                                    
                                    </ul>
                                 </div>
                              }
                           </td>
                           {
                              cancelOrderHandler && <td>
                                 <button className='badge bg-danger' onClick={() => cancelOrderHandler(customerEmail, orderID)}>Cancel Order</button>
                              </td>
                           }

                        </tr>
                     )
                  })
               }
            </tbody>

         </Table>
         {
            openOrderPaymentInfo && <OrderPaymentInfoModal
               orderRefetch={orderRefetch}
               data={openOrderPaymentInfo}
               closeModal={() => setOpenOrderPaymentInfo(false)}
            />
         }

         <ConfirmDialog payload={{
            reference: openBox, openBox, setOpenBox,
            handler: orderDispatchHandler,
            text: `First make sure you downloaded the shipping label.
               So, if downloaded then dispatch this order.`,
            types: "Confirm"
         }} />
      </>
   );
};

export default OrderTable;
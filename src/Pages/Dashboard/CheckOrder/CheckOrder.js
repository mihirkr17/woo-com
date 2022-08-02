import React, { useState } from 'react';
import Modal from '../../../Admin/ManageOrders/Components/Modal/Modal';
import { useOrder } from '../../../App';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';

const CheckOrder = () => {
   const BASE_URL = useBASE_URL();
   const { order, orderRefetch } = useOrder();
   const token = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('accessToken');;
   const [openModal, setOpenModal] = useState(false);

   const orderDispatchHandler = async (orderId, user_email) => {
      if (orderId && user_email) {
         const response = await fetch(`${BASE_URL}api/dispatch-order-request/${orderId}/${user_email}`, {
            method: "PUT",
            headers : {
               "content-type": "application/json",
               authorization: `Bearer ${token}`
            }
         });

         if (response.ok) {
            const resData = await response.json();
            console.log(resData);
            orderRefetch();
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               {order && order.length > 0 && <table className='table table-responsive'>
                  <thead>
                     <tr>
                        <th>Order Id</th>
                        <th>Order Status</th>
                        <th>Payment Mode</th>
                        <th>Price Total</th>
                        <th>Order Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        order.map((order, index) => {
                           const { orderId, status, payment_mode, price_total_amount, user_email } = order?.orders;
                           return (
                              <tr key={index}>
                                 <td>{orderId}</td>
                                 <td>{status}</td>
                                 <td>{payment_mode}</td>
                                 <td>{price_total_amount}&nbsp;$</td>
                                 <td>
                                    <button className='status_btn me-2' onClick={() => orderDispatchHandler(orderId, user_email)}>Dispatch</button>
                                    <button className="status_btn" onClick={() => setOpenModal(true && order?.orders)}>Details</button>
                                 </td>
                              </tr>
                           )
                        })
                     }

                  </tbody>
               </table>
               }
               {
                  order && order.length <= 0 && <p>No order found</p>
               }
            </div>
         </div>
         <Modal
            data={openModal}
            closeModal={() => setOpenModal(false)}
         ></Modal>
      </div>
   );
};

export default CheckOrder;
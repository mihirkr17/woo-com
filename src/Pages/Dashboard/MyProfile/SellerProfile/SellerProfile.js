import React from 'react';

const SellerProfile = ({ userInfo, role, myProductCount }) => {
   return (
      <div className="col-12">
         <div className="card_default">
            <div className="card_description">
               <div className="profile_header">
                  <h6>Seller Information</h6>

                  {
                     (role === "seller") && <div className='ph_i'>
                        <span>Balance : {userInfo?.total_earn || 0}&nbsp;$</span>
                        <button className='bt9_withdraw'>Withdraw</button>
                     </div>
                  }
               </div>
               <article>
                  <address>
                     <pre>
                        <p><strong>Seller Name         : </strong>{userInfo?.username}<span className="text-muted">(Not Changeable)</span></p>
                        <p><strong>Email Address       : </strong>{userInfo?.email}</p>
                        <p><strong>Street              : </strong>{userInfo?.sellerInfo?.address?.street}</p>
                        <p><strong>District            : </strong>{userInfo?.sellerInfo?.address?.district}</p>
                        <p><strong>Country             : </strong>{userInfo?.sellerInfo?.address?.country}</p>
                        <p><strong>Zip Code            : </strong>{userInfo?.sellerInfo?.address?.pinCode}</p>
                        <p><strong>Registered Phone    : </strong>{userInfo?.sellerInfo?.phone}</p>
                     </pre>
                  </address>
                  <div>
                     <pre>
                        <p><strong>Total Product       : </strong>{(myProductCount && myProductCount.count) || 0}&nbsp;Pcs</p>
                        <p><strong>Total Earn          : </strong>{userInfo?.inventoryInfo?.earn || 0}&nbsp;Tk</p>
                        <p><strong>Total Sold Product  : </strong>{userInfo?.inventoryInfo?.totalSell || 0}&nbsp;Items</p>
                     </pre>
                  </div>
               </article>
            </div>
         </div>
      </div>
   );
};

export default SellerProfile;
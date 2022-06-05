import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CartHeader = ({ user }) => {
   return (
      <div className="card_default">
         <div className="card_description">
            <div className="row">
               <div className="col-lg-1"><span>1</span></div>
               <div className="col-lg-8">
                  <h6 className="badge bg-success">Login&nbsp;<FontAwesomeIcon icon={faCheckDouble} /></h6><br />
                  <small>Email :{user?.email} <br /> UserName :{user?.displayName}</small>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartHeader;
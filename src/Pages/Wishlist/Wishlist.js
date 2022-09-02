import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';
import { loggedOut } from '../../Shared/common';

const Wishlist = () => {
   const { userInfo, authRefetch } = useAuthContext();
   const { msg, setMessage } = useMessage();
   const navigate = useNavigate();

   const removeToWishlist = async (productId) => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/wishlist/remove-from-wishlist/${productId}`, {
         method: "DELETE",
         withCredentials: true,
         credentials: "include"
      })

      const resData = await response.json();

      if (response.ok) {
         authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{resData?.message}</strong></small></p>);
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      }
   }
   return (
      <div className='section_default'>
         <div className="container">
            <h6>My Wishlist ({(userInfo?.wishlist && userInfo?.wishlist.length) || 0})</h6>
            {msg}
            <div className="row">
               {
                  userInfo?.wishlist && userInfo?.wishlist.map((product, index) => {
                     return (
                        <div className="col-12" key={index}>
                           <div className="card_default d-flex mb-2">
                              <div className="d-flex px-3">
                                 <div className="cart_img d-flex align-items-center justify-content-center">
                                    <img src={product && product?.image} alt="" />
                                 </div>
                              </div>

                              <div className="row w-100 card_description">
                                 <div className="col-12">
                                    <div className="row">
                                       <div className="col-11">
                                          <p className="card_title"><Link to={`/product/${product?.slug}`}>{product && product?.title}</Link></p>
                                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                                             <small>
                                                <strike className='text-muted'>{product && product?.price}</strike>&nbsp;
                                                <big className='text-info'>{product && product?.pricing?.sellingPrice} TK</big>&nbsp;{product && product?.discount + "% Off"}
                                             </small>
                                             <small className="text-muted">Qty : {product && product?.quantity}</small>
                                             <small className="text-muted">Seller : {product && product?.seller}</small>
                                             <small className="text-muted"> Stock : {product && product?.stock}</small>
                                          </div>
                                       </div>

                                       <div className="remove_btn col-1 text-end">
                                          <button className='btn btn-sm' onClick={() => removeToWishlist(product && product?._id)}><FontAwesomeIcon icon={faClose} /></button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default Wishlist;
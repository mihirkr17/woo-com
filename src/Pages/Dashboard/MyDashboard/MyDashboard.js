import { faBagShopping, faBell, faEye, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../Hooks/useFetch';
import { useAuthContext } from '../../../lib/AuthProvider';
import { useOrder } from '../../../lib/OrderProvider';
import { useSellerChecker } from '../../../lib/SellerCheckProvider';
import CheckOrder from '../CheckOrder/CheckOrder';

const MyDashboard = () => {
   const { userInfo, role } = useAuthContext();
   const { state } = useSellerChecker();
   let url = role === "seller" ? `${process.env.REACT_APP_BASE_URL}api/product/fetch-top-selling-product?seller=${userInfo?.seller}` :
      `${process.env.REACT_APP_BASE_URL}api/product/fetch-top-selling-product`;
   const { data } = useFetch(url);
   const { data: totalProduct } = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/product-count?seller=${userInfo?.seller}`);
   const { orderCount } = useOrder();
   // search query params
   const queryParams = new URLSearchParams(window.location.search).get("check_order");
   const querySeller = new URLSearchParams(window.location.search).get("seller");

   return (
      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-12 mydb">
                  <div className="mydb_head">
                     {
                        (role === "admin") &&
                        <Link to='/dashboard/check-seller'>Check Seller {state?.slLength}</Link>
                     }
                  </div>
                  <div className="search_result">

                  </div>
               </div>
               <div className="col-12">
                  <div className="row">
                     <div className="col-lg-4">
                        <div className="card_default card_description">
                           <div className="d_p_head">
                              <div className='d_p_icon'>
                                 {
                                    (role === "seller") &&
                                    <>
                                       <Link to={`/dashboard?check_order=order_checking&seller=${userInfo?.seller}`}>
                                          <FontAwesomeIcon icon={faBell} />
                                          <span className="o_counter">{orderCount}</span>
                                       </Link>
                                    </>
                                 }
                              </div>
                              <div className="d_p_icon">
                                 <Link to='my-profile'><FontAwesomeIcon icon={faEye} /></Link>
                              </div>
                           </div>
                           <div className="d_p">
                              <div className="d_p_mid">
                                 <div className="d_p_mid_img">
                                    <img src={userInfo?.photoURL} alt="" style={{ width: "100%", height: "100%" }} />
                                 </div>
                                 <h5>{role === "seller" ? userInfo?.seller : userInfo?.displayName}</h5>
                              </div>
                           </div>

                           <div className="d_p_footer">
                              {
                                 role === "seller" && <div className='t_p'>
                                    <div className='t_p_icon'>
                                       <FontAwesomeIcon icon={faBagShopping} />
                                    </div>

                                    <div className="t_p_right">
                                       <div className='t_p_right_text'>
                                          <strong>{
                                             totalProduct && totalProduct.count
                                          }</strong>
                                          <span>Products</span>
                                       </div>
                                    </div>
                                 </div>
                              }
                              <div className='t_p'>
                                 <div className='t_p_icon'>
                                    <FontAwesomeIcon icon={faUserFriends} />
                                 </div>

                                 <div className="t_p_right">
                                    <div className='t_p_right_text'>
                                       <strong>{
                                          totalProduct && totalProduct.count
                                       }</strong>
                                       <span>Followers</span>
                                    </div>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>
                     <div className="col-lg-8">

                        <div className='card_default card_description mb-3'>
                           <h6>Overview</h6>
                        </div>


                        <div className="card_default card_description mb-3">
                           <h6>Top Selling Product</h6>
                           <div className="table-responsive">
                              <table className='table table-borderless table-sm'>
                                 <thead className="table-dark">
                                    <tr>
                                       <th>Product</th>
                                       <th>Title</th>
                                       <th>Category</th>
                                       <th>Brand</th>
                                       <th>Price(tk)</th>
                                       {role !== "seller" && <th>Seller</th>}
                                       <th>Sell</th>
                                    </tr>

                                 </thead>
                                 <tbody>
                                    {
                                       data && data.map((product, index) => {
                                          return (
                                             <tr key={index}>
                                                <td><img className='jjk_2m2' src={product?.image[0]} alt="" /></td>
                                                <td>
                                                   <small>{product?.title.length > 30 ? product?.title.slice(0, 30) + "..." : product?.title}</small> <br />
                                                   <small className='pid'>#{product?._id}</small>
                                                </td>
                                                <td><small>{product?.genre?.category}</small></td>
                                                <td><small>{product?.brand}</small></td>
                                                <td><small>{product?.pricing?.sellingPrice}</small></td>
                                                {role !== "seller" && <td>{product?.seller}</td>}
                                                <td><small>{product?.top_sell || 0}</small></td>
                                             </tr>
                                          )
                                       })
                                    }

                                 </tbody>
                              </table>
                           </div>
                        </div>

                        {
                           (queryParams === "order_checking" && querySeller === userInfo?.seller && role === "seller") && <CheckOrder />
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyDashboard;
import { Interweave } from 'interweave';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { faCartShopping, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breadcrumbs from './Breadcrumbs';
import { averageRating } from './common';
import { useState } from 'react';

const ProductModel = ({ product, addToCartHandler, addCartLoading, buyLoading, showFor, addToWishlist, removeToWishlist }) => {
   const navigate = useNavigate();
   const [tab, setTab] = useState("description");

   return (
      <div className="row mb-5">
         <div className="col-lg-5 pb-3">
            <div className="view_product_sidebar">
               <div className="product_image">
                  <img src={product?.image} style={{ height: "50vh" }} alt="" />
               </div>


            </div>
         </div>
         <div className="col-lg-7 pb-3">
            <article className="product_description">
               {(showFor === "user") && <Breadcrumbs path={[product?.genre?.category, product?.genre?.sub_category, product?.genre?.second_category]}></Breadcrumbs>}
               <strong className="badge bg-primary">
                  {product?.genre?.category}
               </strong>
               <h5 className="product_title py-3">{product?.title}</h5>
               <small><strike>{product?.price}</strike> - <span>{product?.discount}%</span></small>&nbsp;
               <big className='text-success'>${product?.price_fixed}</big><br />
               <small className=' badge bg-success'>Rating : {averageRating(product?.rating) || 0}/5</small><br />
               <small className='text-muted'><i>{product?.stock === "out" ? "Out of Stock" : "Hurry, Only " + product?.available + " Left !"} </i></small><br />
               <small className='text-muted'>Seller : {product?.seller}</small><br />
               {
                  (showFor !== "user") && <small>{product?.genre?.category + " > " + product?.genre?.sub_category + " > " + product?.genre?.second_category}</small>
               }

            </article>
            <div className="d-flex align-items-end justify-content-center py-2">
               {
                  (showFor === "user") && <div className="d-flex align-items-center justify-content-center py-3 mt-4">
                     {
                        product?.inWishlist ? <button className='wishlistBtn' onClick={() => removeToWishlist(product?._id)}><FontAwesomeIcon icon={faHeartCircleCheck} /></button>
                           : <button className='wishlistBtn' onClick={() => addToWishlist(product)}><FontAwesomeIcon icon={faHeart} /></button>
                     }
                     {
                        product?.inCart === false ?
                           <button className='ms-4 addToCartBtn' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "toCart")}>
                              {addCartLoading ? <BtnSpinner text={"Adding..."}></BtnSpinner> : <><FontAwesomeIcon icon={faCartShopping} /> Add To Cart</>}
                           </button> :
                           <button className='ms-4 addToCartBtn' onClick={() => navigate('/my-cart')}>
                              Go To Cart
                           </button>
                     }

                     <button className='ms-4 buyBtn' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "buy")}>
                        {buyLoading ? <BtnSpinner text={"Buying..."}></BtnSpinner> : <> Buy Now</>}
                     </button>
                  </div>
               }
            </div>
         </div>
         <div className="col-12 py-3 mt-3 card_default">
            <div className="ff_kl3">
               <button className={`ddl_g_btn ${tab === "description" ? "active" : ""}`} onClick={() => setTab("description")}>Product Description</button>
               <button className={`ddl_g_btn ${tab === "spec" ? "active" : ""}`} onClick={() => setTab("spec")}>Specification</button>
               {(showFor === "user" || showFor === "seller") && <>
                  <button className={`ddl_g_btn ${tab === "pd" ? "active" : ""}`} onClick={() => setTab("pd")}>Purchase & Delivery</button>
                  <button className={`ddl_g_btn ${tab === "rfp" ? "active" : ""}`} onClick={() => setTab("rfp")}>Refound Policy</button>
                  <button className={`ddl_g_btn ${tab === "rpp" ? "active" : ""}`} onClick={() => setTab("rpp")}>Replace Policy</button>
               </>
               }

            </div>
            <div className="dp_fgk card_description">
               {
                  tab === "description" && <Interweave className='pt-4 product_spec' content={product?.description} />
               }
               {
                  tab === "spec" && <table className='table table-sm'>
                     <thead>
                        <tr>
                           <th>Product Specification : </th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           product?.info?.specification && product?.info?.specification.map((items, index) => {
                              return (
                                 <tr key={index}>
                                    <th>{items?.type} </th>
                                    <td>: {items?.value}</td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>
               }
               {
                  ((showFor === "user") || (showFor === "seller")) && <>
                     {
                        (tab === "pd") && <>
                           <h6>Purchase Step</h6>
                           <ul>
                              {
                                 product?.policy?.purchase_policy && product?.policy?.purchase_policy.map((item, i) => {
                                    return (
                                       <li style={{ listStyle: "disc", marginBottom: "0.8rem", fontSize: "0.9rem" }} key={i}>{item}.</li>
                                    )
                                 })
                              }
                           </ul>

                           <h6>How To Payment</h6>
                           <table className='table table-sm table-borderless'>
                              <thead></thead>
                              <tbody>
                                 {
                                    product?.policy?.pay_information && product?.policy?.pay_information.map((item, i) => {
                                       return (
                                          <tr key={i}>
                                             <th>{item?.types} : </th>
                                             <td>{item?.values}</td>
                                          </tr>
                                       )
                                    })
                                 }
                              </tbody>
                           </table>
                        </>
                     }
                     {
                        tab === "rfp" && <ul>
                           {
                              product?.policy?.refund_policy && product?.policy?.refund_policy.map((item, i) => {
                                 return (
                                    <li style={{ listStyle: "disc", marginBottom: "0.8rem", fontSize: "0.9rem" }} key={i}>{item}</li>
                                 )
                              })
                           }
                        </ul>
                     }

                     {
                        tab === "rpp" && <ul>
                           {
                              product?.policy?.replace_policy && product?.policy?.replace_policy.map((item, i) => {
                                 return (
                                    <li style={{ listStyle: "auto", marginBottom: "0.8rem", fontSize: "0.9rem" }} key={i}>{item}</li>
                                 )
                              })
                           }
                        </ul>
                     }
                  </>
               }

            </div>
         </div>
      </div>
   );
};

export default ProductModel;
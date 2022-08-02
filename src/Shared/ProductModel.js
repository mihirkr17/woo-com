import { Interweave } from 'interweave';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import useAuth from '../Hooks/useAuth';
import { averageRating } from "./averageRating";
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Breadcrumbs from './Breadcrumbs';

const ProductModel = ({ product, addToCartHandler, addCartLoading, buyLoading }) => {
   const navigate = useNavigate();
   const { role } = useAuth();

   return (
      <div className="row mb-5">
         <div className="col-lg-5 pb-3">
            <div className="view_product_sidebar">
               <div className="product_image">
                  <img src={product?.image} style={{ height: "50vh" }} alt="" />
               </div>
               {
                  (role !== "owner" && role !== "admin" && role !== "seller") && <div className="d-flex align-items-center justify-content-center py-3 mt-4">
                     {
                        product?.cardHandler === false ?
                           <button className='addToCartBtn' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "toCart")}>
                              {addCartLoading ? <BtnSpinner text={"Adding..."}></BtnSpinner> : <><FontAwesomeIcon icon={faCartShopping} /> Add To Cart</>}
                           </button> :
                           <button className='addToCartBtn' onClick={() => navigate('/my-cart')}>
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
         <div className="col-lg-7 pb-3">
            <article className="product_description">
               <Breadcrumbs></Breadcrumbs>
               <strong className="badge bg-primary">
                  {product?.category}
               </strong>
               <h5 className="product_title py-3">{product?.title}</h5>
               <small><strike>{product?.price}</strike> - <span>{product?.discount}%</span></small>&nbsp;
               <big className='text-success'>${product?.price_fixed}</big><br />
               <small className='text-warning'>Rating : {averageRating(product?.rating) || 0}/5</small><br />
               <small className='text-muted'><i>{product?.stock === "out" ? "Out of Stock" : "Hurry, Only " + product?.available + " Left !"} </i></small>
               <Interweave className='pt-4 product_spec' content={product?.description} />
            </article>
         </div>
      </div>

   );
};

export default ProductModel;
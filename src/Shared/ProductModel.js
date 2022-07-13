import { Interweave } from 'interweave';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import { useAuthUser } from '../lib/UserProvider';
import { averageRating } from "./averageRating";

const ProductModel = ({ product, addToCartHandler }) => {
   const navigate = useNavigate();
   const user = useAuthUser();
   const { role } = useAuth(user);
   return (
      <div className="row mb-5">
         <div className="col-lg-5 pb-3">
            <div className="view_product_sidebar">
               <div className="product_image">
                  <img src={product?.image} style={{ height: "50vh" }} alt="" />
               </div>
               {
                  (role !== "owner" && role !== "admin") && <div className="d-flex align-items-center justify-content-center py-3 mt-4">
                     {
                        product?.cardHandler === false ?
                           <button className='btn btn-primary' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product)}>Add To Cart</button> :
                           <button className='btn btn-primary' onClick={() => navigate('/my-cart')}>Go To Cart</button>
                     }

                     <button className='btn btn-warning ms-4' disabled={product?.stock === "out" ? true : false} onClick={() => addToCartHandler(product, "buy")}>Buy Now</button>
                  </div>
               }

            </div>
         </div>
         <div className="col-lg-7 pb-3">
            <article className="product_description">
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
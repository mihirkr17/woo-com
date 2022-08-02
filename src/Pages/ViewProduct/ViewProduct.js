import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import "./ViewProduct.css";
import { useMessage } from '../../Hooks/useMessage';
import { useAuthUser } from '../../lib/UserProvider';
import { useBASE_URL } from "../../lib/BaseUrlProvider";
import Product from '../../Shared/Product';
import { averageRating } from "../../Shared/averageRating";
import ProductModel from '../../Shared/ProductModel';
import { useCart } from '../../App';
import { useState } from 'react';


const ViewProduct = () => {
   const BASE_URL = useBASE_URL();
   const { product_slug } = useParams();
   const user = useAuthUser();
   const { refetch } = useCart();
   const { data: product, loading, refetch: productRefetch } = useFetch(`${BASE_URL}api/fetch-single-product/${product_slug}/${user?.email}`);
   const { data: rating } = useFetch(`${BASE_URL}product-review/${product?._id}`);
   const { data: productByCategory } = useFetch(`${BASE_URL}api/product-by-category?sub_category=${product?.sub_category}`);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [buyLoading, setBuyLoading] = useState(false);

   if (loading) return <Spinner></Spinner>;

   const addToCartHandler = async (product, params) => {

      const url = params === "buy" ? `${BASE_URL}api/add-buy-product/${user?.email}` :
         `${BASE_URL}api/add-to-cart/${user?.email}`;
         
      let quantity = 1;
      let productPrice = parseInt(product?.price);
      let discount_amount_fixed = parseFloat(product?.discount_amount_fixed)
      let discount_amount_total = discount_amount_fixed * quantity;

      product['user_email'] = user?.email;
      product['quantity'] = quantity;
      product['price_total'] = (productPrice * quantity) - discount_amount_total;
      product['discount_amount_total'] = discount_amount_total;

      if (product?.stock === "in") {
         if (params === "buy") {
            setBuyLoading(true);
         } else {
            setAddCartLoading(true);
         }

         const response = await fetch(url, {
            method: "PUT",
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(product)
         });

         const resData = response.ok && await response.json();
         if (resData) {
            refetch();
            productRefetch();
            setMessage(resData?.message);

            if (params === "buy") {
               setBuyLoading(false);
               navigate(`/product/purchase/${product?._id}`);
            } else {
               setAddCartLoading(false);
               navigate('/my-cart');
            }
         }
      }
   }

   return (
      <div className='view_product section_default'>
         <div className="container">
            {msg}
            <ProductModel product={product} buyLoading={buyLoading} addCartLoading={addCartLoading} addToCartHandler={addToCartHandler}></ProductModel>
            <div className="row pt-5">
               <div className="col-lg-9">
                  <h5 id='rating' className='text-center py-1'>Rating And Review Of {product?.title}</h5>
                  <div className="row mt-5 border">
                     <div className="py-1 my-4 border-bottom">
                        <div className="row">
                           <div className="col-lg-6">
                              <div className="p-4">
                                 <p className='text-warning'>
                                    <span className="fs-1">
                                       {averageRating(product?.rating) || 0}
                                    </span>
                                    <span className="fs-4 text-muted">/5</span>
                                 </p>
                                 <div>
                                    {rating && rating.map(rats => rats?.rating).length} Ratings
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {
                        rating && rating.length > 0 ? rating.map((rats, index) => {
                           const { rating } = rats;
                           let cName = rating?.rating_customer.lastIndexOf("@");
                           return (
                              <div className="col-lg-12 mb-3" key={index}>
                                 <div className="card_default">
                                    <div className="card_description">
                                       <small className='text-warning'>{rating?.rating_point} Out of 5</small>
                                       <i className='text-muted'>{rating?.rating_customer.slice(0, cName)}</i>
                                       <small>{rating?.rating_description}</small>
                                    </div>
                                 </div>
                              </div>
                           )
                        }) : <div className="p-4 d-flex align-items-center justify-content-center">
                           <p>No Reviews</p>
                        </div>
                     }
                  </div>
               </div>
               <div className="col-lg-3">
                  <h5 className="text-center py-1">Related Product</h5>
                  <div className="row">
                     {
                        productByCategory && productByCategory.map(p => {
                           return (
                              <div key={p?._id} className="col-10 mx-auto mb-2">
                                 <Product product={p}></Product>
                              </div>
                           )
                        }).reverse().slice(0, 4)
                     }

                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ViewProduct;
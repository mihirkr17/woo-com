import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import "./ViewProduct.css";
import { useMessage } from '../../Hooks/useMessage';
import Product from '../../Shared/Product';
import ProductModel from '../../Shared/ProductModel';
import { useAuthUser } from '../../App';
import { useState } from 'react';
import { averageRating, loggedOut } from '../../Shared/common';
import { useAuthContext } from '../../lib/AuthProvider';


const ViewProduct = () => {
   const { product_slug } = useParams();
   const user = useAuthUser();
   const { authRefetch, role } = useAuthContext();
   const { data: product, loading, refetch: productRefetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/fetch-single-product/${product_slug}/${user?.email}`);
   const { data: productByCategory } = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/product-by-category?sub_category=${product?.genre?.sub_category}`);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [buyLoading, setBuyLoading] = useState(false);

   const addToCartHandler = async (product, params) => {

      const url = params === "buy" ? `${process.env.REACT_APP_BASE_URL}api/cart/add-buy-product` :
         `${process.env.REACT_APP_BASE_URL}api/cart/add-to-cart`;

      let cartProduct = {
         _id: product?._id,
         title: product?.title,
         slug: product?.slug,
         brand: product?.brand,
         size: product?.size,
         image: product.image[0],
         quantity: 1,
         price: parseFloat(product?.pricing?.specialPrice || product?.pricing?.sellingPrice),
         totalAmount: parseFloat(product?.pricing?.specialPrice || product?.pricing?.sellingPrice) * 1,
         discount: product?.discount,
         seller: product?.seller,
         sku: product?.sku,
         package_dimension: product?.package_dimension,
         in_box: product?.info?.in_box,
         stock: product?.stock,
         available: product?.available,
         delivery_service: product?.delivery_service,
         payment_option: product?.payment_option,
         shipping_fee: product?.shipping_fee || 0
      }


      if (product?.stock === "in") {
         if (params === "buy") {
            setBuyLoading(true);
         } else {
            setAddCartLoading(true);
         }

         const response = await fetch(url, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(cartProduct)
         });

         const resData = await response.json();

         if (response.ok) {
            authRefetch();
            productRefetch();
            setMessage(resData?.message);

            if (params === "buy") {
               setBuyLoading(false);
               navigate(`/product/purchase/${product?._id}`);
            } else {
               setAddCartLoading(false);
               navigate('/my-cart');
            }

         } else {
            setAddCartLoading(false);
            setBuyLoading(false);
            await loggedOut();
            navigate(`/login?err=${resData?.message} token not found`);
         }
      }
   }

   const addToWishlist = async (product) => {

      let wishlistProduct = {
         _id: product._id,
         title: product.title,
         slug: product.slug,
         brand: product.brand,
         image: product.image[0],
         pricing: product?.pricing,
         stock: product?.stock,
         user_email: user?.email,
         seller: product?.seller
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/wishlist/add-to-wishlist/${user?.email}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(wishlistProduct)
      })

      const resData = await response.json();

      if (response.ok) {
         productRefetch();
         authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{resData?.message}</strong></small></p>);
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      }
   }

   const removeToWishlist = async (productId) => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/wishlist/remove-from-wishlist/${productId}`, {
         method: "DELETE",
         withCredentials: true,
         credentials: "include"
      })

      const resData = await response.json();

      if (response.ok) {
         productRefetch();
         authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{resData?.message}</strong></small></p>);
      } else {
         await loggedOut();
         navigate(`/login?err=${resData?.message} token not found`);
      }
   }

   return (
      <div className='view_product section_default'>
         <div className="container">
            {msg}
            {loading ? <Spinner /> :
            <ProductModel showFor={role} product={product} buyLoading={buyLoading}
               addCartLoading={addCartLoading} addToCartHandler={addToCartHandler}
               addToWishlist={addToWishlist}
               removeToWishlist={removeToWishlist}
            ></ProductModel>
            }
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
                                       {(product?.rating_average) || 0}
                                    </span>
                                    <span className="fs-4 text-muted">/5</span>
                                 </p>
                                 <div>
                                    {product?.reviews && product?.reviews.length} Reviews
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {
                        product?.reviews && product?.reviews.length > 0 ? product?.reviews.map((rats, index) => {
                           return (
                              <div className="col-lg-12 mb-3" key={index}>
                                 <div className="card_default">
                                    <div className="card_description">
                                       <small className='text-warning'>{rats?.rating_point && rats?.rating_point} Out of 5</small>
                                       <i className='text-muted'>{rats?.rating_customer && rats?.rating_customer}</i>
                                       <small>{rats?.rating_description && rats?.rating_description}</small>
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
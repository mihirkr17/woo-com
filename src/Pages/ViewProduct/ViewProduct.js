import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import "./ViewProduct.css";
import { useMessage } from '../../Hooks/useMessage';
import Product from '../../Components/HomeComponents/HomeStoreComponents/Product';
import { useAuthUser } from '../../lib/UserProvider';
import { Interweave } from 'interweave';
import { useBASE_URL } from "../../lib/BaseUrlProvider";


const ViewProduct = () => {
   const BASE_URL = useBASE_URL();
   const { productId } = useParams();
   const user = useAuthUser();
   const { data: product, loading } = useFetch(`${BASE_URL}view-product/${productId}/${user?.email}`);
   const { data: rating } = useFetch(`${BASE_URL}product-review/${productId}`);
   const { data: productByCategory } = useFetch(`${BASE_URL}product-category/${product?.category}`);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();

   if (loading) return <Spinner></Spinner>;


   const addToCartHandler = async (product, params) => {

      let quantity = 1;
      let productPrice = parseInt(product?.price);
      let discount_amount_fixed = parseFloat(product?.discount_amount_fixed)
      let discount_amount_total = discount_amount_fixed * quantity;

      product['user_email'] = user?.email;
      product['quantity'] = quantity;
      product['price_total'] = (productPrice * quantity) - discount_amount_total;
      product['discount_amount_total'] = discount_amount_total;

      const response = await fetch(`${BASE_URL}my-cart/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(product)
      });

      const resData = await response.json();

      if (resData) {
         setMessage(resData?.message);
         if (params === "buy") {
            navigate(`/product/purchase/${product?._id}`);
         } else {
            navigate('/my-cart');
         }
      }
   }

   // rating algorithm
   let weightVal = 0;
   let countValue = 0;
   product?.rating && product?.rating.length > 0 && product?.rating.forEach(rat => {
      const multiWeight = parseInt(rat?.weight) * parseInt(rat?.count);
      weightVal += multiWeight;
      countValue += rat?.count;
   });
   const ava = weightVal / countValue;
   const averageRating = ava.toFixed(2);

   const productDiscount = product?.discount || 0;
   const dis = (productDiscount / 100) * product?.price;
   const finalPrice = product?.price - dis;

   return (
      <div className='view_product section_default'>
         <div className="container">
            {msg}
            <div className="row mb-5">
               <div className="col-lg-5 pb-3">
                  <div className="view_product_sidebar">
                     <div className="product_image">
                        <img src={product?.image} style={{ height: "50vh" }} alt="" />
                     </div>
                     <div className="d-flex align-items-center justify-content-evenly py-3 mt-4">
                        {
                           product?.cardHandler === false ?
                              <button className='btn btn-primary' onClick={() => addToCartHandler(product)}>Add To Cart</button> :
                              <button className='btn btn-primary' onClick={() => navigate('/my-cart')}>Go To Cart</button>
                        }

                        <button className='btn btn-warning' onClick={() => addToCartHandler(product, "buy")}>Buy Now</button>
                     </div>
                  </div>
               </div>
               <div className="col-lg-7 pb-3">
                  <article className="product_description">
                     <strong className="badge bg-primary">
                        {product?.category}
                     </strong>
                     <h5 className="product_title py-3">{product?.title}</h5>
                     <small><strike>{product?.price}</strike> - <span>{product?.discount}%</span></small>&nbsp;
                     <big className='text-success'>{finalPrice.toFixed(2)}$</big><br />
                     <small className='text-warning'>Rating : {averageRating || 0}/5</small>
                     {/* <div className='pt-4 product_spec' dangerouslySetInnerHTML={{ __html : product?.description }}></div> */}
                     <Interweave className='pt-4 product_spec' content={product?.description} />
                  </article>
               </div>
            </div>

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
                                       {averageRating}
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
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../Hooks/useFetch';
import "./ViewProduct.css";
import { useMessage } from '../../Hooks/useMessage';
import { useAuthContext } from '../../lib/AuthProvider';
import RelatedProducts from './Components/RelatedProducts';
import ProductReviews from './Components/ProductReviews';
import ProductImages from './Components/ProductImages';
import ProductContents from './Components/ProductContents';
import ProductAdditionalDetails from './Components/ProductAdditionalDetails';


const ViewProduct = () => {
   const { product_slug } = useParams();

   const { authRefetch, userInfo } = useAuthContext();

   const productId = new URLSearchParams(window.location.search).get("pId");

   const variationId = new URLSearchParams(window.location.search).get("vId");

   const { data, refetch: productRefetch } = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/fetch-single-product/${product_slug}?pId=${productId}&vId=${variationId}`, userInfo?.email);

   const { msg, setMessage } = useMessage();

   return (
      <div className='view_product section_default'>
         <div className="container">
            {msg}

            <div className="row mb-5">
               <div className="col-lg-5 pb-3">
                  <ProductImages
                     product={data?.data?.product ? data?.data?.product : {}}
                     userInfo={userInfo}
                     authRefetch={authRefetch}
                     setMessage={setMessage}
                     productRefetch={productRefetch}
                  />
               </div>


               <div className="col-lg-7 pb-3 product_description">
                  <ProductContents
                     product={data?.data?.product ? data?.data?.product : {}}
                     variationId={variationId}
                     authRefetch={authRefetch}
                     productRefetch={productRefetch}
                     setMessage={setMessage}
                  />
               </div>
            </div>

            <div className="row">
               <ProductAdditionalDetails
                  product={data?.data?.product ? data?.data?.product : {}}
               />
            </div>


            <div className="row pt-5">
               <div className="col-lg-12">
                  <ProductReviews
                     product={data?.data?.product ? data?.data?.product : {}}
                  />
               </div>
               <div className="col-lg-12 pt-4">
                  <RelatedProducts
                     relatedProducts={data?.data?.relatedProducts ? data?.data?.relatedProducts : []}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default ViewProduct;
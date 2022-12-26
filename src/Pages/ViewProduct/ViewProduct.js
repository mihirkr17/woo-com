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

            <div className=" mb-5 vp_row">
               <div className="pb-3 vp_col_one">
                  <ProductImages
                     product={data?.data?.product ? data?.data?.product : {}}
                     userInfo={userInfo}
                     authRefetch={authRefetch}
                     setMessage={setMessage}
                     productRefetch={productRefetch}
                  />
               </div>


               <div className="pb-3 product_description vp_col_two">
                  <ProductContents
                     product={data?.data?.product ? data?.data?.product : {}}
                     variationId={variationId}
                     authRefetch={authRefetch}
                     productRefetch={productRefetch}
                     setMessage={setMessage}
                  />

                  <ProductAdditionalDetails
                     product={data?.data?.product ? data?.data?.product : {}}
                  />

                  <ProductReviews
                     product={data?.data?.product ? data?.data?.product : {}}
                  />

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
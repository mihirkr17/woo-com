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
import Breadcrumbs from '../../Shared/Breadcrumbs';
import Spinner from '../../Components/Shared/Spinner/Spinner';


const ViewProduct = () => {
   const { product_slug } = useParams();

   const { authRefetch, userInfo } = useAuthContext();

   const productID = new URLSearchParams(window.location.search).get("pId");

   const variationID = new URLSearchParams(window.location.search).get("vId");

   const { data, refetch: productRefetch, loading } = useFetch(`${process.env.REACT_APP_BASE_URL}api/v1/product/fetch-single-product/${product_slug}?pId=${productID}&vId=${variationID}`, userInfo?.email);

   const { msg, setMessage } = useMessage();

   const product = data?.data?.product ? data?.data?.product : {};

   if (loading) {
      return <Spinner />;
   }

   return (
      <div className='view_product section_default'>
         <div className="container">
            {/* breadcrumbs  */}
            <Breadcrumbs
               path={(Array.isArray(product?.categories)) && product?.categories}
            />
            {msg}
            {/* first content  */}
            <div className=" mb-5 row">
               <div className="pb-3 col-lg-4">
                  <ProductImages
                     product={product}
                     userInfo={userInfo}
                     authRefetch={authRefetch}
                     setMessage={setMessage}
                     productRefetch={productRefetch}
                  />
               </div>


               <div className="pb-3 product_description col-lg-8">
                  <ProductContents
                     product={product}
                     variationID={variationID}
                     authRefetch={authRefetch}
                     productRefetch={productRefetch}
                     setMessage={setMessage}
                     userInfo={userInfo}
                  />
               </div>
            </div>

            <div className="row">
               <div className="col-lg-12">
                  <ProductAdditionalDetails
                     product={product}
                  />
               </div>
               <div className="col-lg-12">
                  <ProductReviews
                     product={product}
                  />
               </div>
               <div className="col-lg-12">
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
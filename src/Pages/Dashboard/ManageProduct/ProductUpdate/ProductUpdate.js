import React from 'react';
import { useFetch } from '../../../../Hooks/useFetch';
import ProductTemplateForm from '../Components/ProductTemplateForm';

const ProductUpdate = ({ userInfo, setMessage, formTypes }) => {
   const queryPID = new URLSearchParams(window.location.search).get("pid");
   const queryVID = new URLSearchParams(window.location.search).get("vId");
   const {data, refetch} = useFetch(`${process.env.REACT_APP_BASE_URL}api/product/fetch-single-product-by-pid?pid=${queryPID}&storeName=${userInfo?.seller?.storeInfos?.storeName}&vId=${queryVID || ""}`);

   if (data) {
      return (
         <ProductTemplateForm formTypes={formTypes} userInfo={userInfo} data={data && data} setMessage={setMessage} refetch={refetch} />
      );
   }
};

export default ProductUpdate;
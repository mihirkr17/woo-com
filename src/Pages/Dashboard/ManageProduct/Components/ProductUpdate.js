import React from 'react';
import { useFetch } from '../../../../Hooks/useFetch';
import ProductTemplateForm from './ProductTemplateForm';

const ProductUpdate = ({ userInfo, setMessage }) => {
   const queryPID = new URLSearchParams(window.location.search).get("pid")
   const {data, refetch} = useFetch(`${process.env.REACT_APP_BASE_URL}api/fetch-single-product-by-pid?pid=${queryPID}&seller=${userInfo?.seller}`);

   if (data) {
      return (
         <ProductTemplateForm formTypes={"update"} userInfo={userInfo} data={data && data} setMessage={setMessage} refetch={refetch} />
      );
   }
};

export default ProductUpdate;
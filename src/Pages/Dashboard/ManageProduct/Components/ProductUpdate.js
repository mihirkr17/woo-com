import React from 'react';
import ProductTemplateForm from '../../../../Shared/ProductTemplateForm';

const ProductUpdate = ({ data, refetch, modalClose, setMessage }) => {
   return (
      <ProductTemplateForm formTypes={"update"} data={data} modalClose={modalClose} refetch={refetch} />
   );
};

export default ProductUpdate;
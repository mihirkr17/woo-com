import React from 'react';
import ProductTemplateForm from '../../../../Shared/ProductTemplateForm';

const ProductUpdate = ({ data, refetch, modalClose, setMessage }) => {
   return (

      <div className='section_default'>
         <div className="container">
            <ProductTemplateForm formTypes={"update"} data={data} modalClose={modalClose} refetch={refetch}/>
         </div>
      </div>
   );
};

export default ProductUpdate;
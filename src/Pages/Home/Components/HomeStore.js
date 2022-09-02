import React, { useEffect } from 'react';
import { useState } from 'react';
import BtnSpinner from '../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useFetch } from '../../../Hooks/useFetch';
import Product from '../../../Shared/Product';

const HomeStore = () => {
   const [url, setUrl] = useState("");
   const [limit, setLimit] = useState(12);
   const { data, loading } = useFetch(url);

   useEffect(() => {
      setUrl(limit && `${process.env.REACT_APP_BASE_URL}api/product/all-products/${limit}`)
   }, [limit]);

   const showMoreHandler = () => {
      let number = limit + 6;
      setLimit(number);
   }

   return (
      <section className='section_default'>
         <div className="container">
            <div className="d-flex justify-content-between py-2">
               <h5 className="py-2">Just For You</h5>
            </div>
            <div className='row'>
               {
                  data && data.map(product => {
                     return (
                        <div className="col-sm-5 col-md-4 col-lg-2" key={product._id}>
                           <Product product={product} key={product._id}></Product>
                        </div>
                     )
                  })
               }
            </div>
            <div className="py-3 text-center">
               <button
                  className={data && data.length < limit ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-primary'}
                  disabled={data && data.length < limit ? true : false}
                  onClick={showMoreHandler}>
                  {
                     loading ? <BtnSpinner /> : (data && data.length < limit) ? "No available products here" : "See More"
                  }
               </button>
            </div>
         </div>
      </section>
   );
};

export default HomeStore;
import React, { useEffect } from 'react';
import { useState } from 'react';
import BtnSpinner from '../../../Components/Shared/BtnSpinner/BtnSpinner';
import { useFetch } from '../../../Hooks/useFetch';
import Product from '../../../Shared/Product';
import TopRated from './TopRated';
import TopSell from './TopSell';
import Spinner from '../../../Components/Shared/Spinner/Spinner';

const HomeStore = () => {
   const [url, setUrl] = useState("");
   const [limit, setLimit] = useState(12);
   const { data, loading } = useFetch(url);

   useEffect(() => {
      setUrl(limit && `${process.env.REACT_APP_BASE_URL}api/v1/product/store/${limit}`)
   }, [limit]);

   const showMoreHandler = () => {
      let number = limit + 6;
      setLimit(number);
   }

   if (loading) {
      return <Spinner />;
   }

   return (
      <>
         <TopRated data={data?.data?.topRatedProducts ? data?.data?.topRatedProducts : []} />
         {/* <TopSell data={data?.data?.topSellingProducts ? data?.data?.topSellingProducts : []} /> */}

         <section className='section_default'>
            <div className="container">
               <div className="d-flex justify-content-between py-2">
                  <h5 className="py-2">Just For You</h5>
               </div>
               <div className='row product_wrapper'>

                     {
                        data?.data?.store && data?.data?.store.map((product, index) => {
                           return (

                              <Product key={index} product={product} ></Product>

                           )
                        })
                     }

               </div>
               <div className="py-3 text-center">
                  <button
                     className={data?.data?.store && data?.data?.store.length < limit ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-primary'}
                     disabled={data?.data?.store && data?.data?.store.length < limit ? true : false}
                     onClick={showMoreHandler}>
                     {
                        loading ? <BtnSpinner /> : (data?.data?.store && data?.data?.store.length < limit) ? "No available products here" : "See More"
                     }
                  </button>
               </div>
            </div>
         </section>
      </>
   );
};

export default HomeStore;
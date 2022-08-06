import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import Product from '../../Shared/Product';

const SearchPage = () => {
   const query = new URLSearchParams(window.location.search).get("q");
   const { data, loading } = useFetch(query && `${process.env.REACT_APP_BASE_URL}api/search-products/${query}`);
   const navigate = useNavigate();

   useEffect(() => {
      if (query === "") {
         navigate("/");
      }
   }, [navigate, query]);

   return (
      <div className='section_default'>
         <div className="container">

            <div className="py-2">
               {
                  query && <><h6>{`Search result for ${query}`}</h6><small>{data && data.length}</small></>
               }
            </div>
            <div className="row">
               {
                  loading ? <Spinner /> : data && data.length > 0 ? data.map((product, index) => {
                     return (
                        <div className="col-lg-2 col-md-4" key={index}>
                           <Product product={product}></Product>
                        </div>
                     )
                  }) : <p>No Result found</p>
               }
            </div>
         </div>
      </div>
   );
};

export default SearchPage;
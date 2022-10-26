import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';

const SearchPage = ({ data, loading }) => {

   return (
      <div className='card_default card_description'>
         {
            loading ? <Spinner /> : (data && data.length > 0) ? data.map((product, index) => {
               return (
                  <div className="d-flex flex-row align-items-center justify-content-start mb-3" key={index}>
                    <img src={product?.images && product?.images[0]} style={{ width: "25px", height: "25px", marginRight: "0.8rem", marginBottom: "0.4rem" }} alt="" />
                    <Link to={`/c/${product?.categories && (product?.categories.join("/").toString())}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
                  </div>
               )
            }) : <p>No Product Found...</p>
         }
      </div>
   );
};

export default SearchPage;
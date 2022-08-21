import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';

const SearchPage = ({ data, loading }) => {
   
   return (
      <div className='card_default card_description'>
         {
            loading ? <Spinner /> : (data && data.length > 0) && data.map((product, index) => {
               return (
                  <div className="d-flex flex-row align-items-center justify-content-start" key={index}>
                    <img src={product?.image[0]} style={{ width: "25px", height: "25px", marginRight: "0.8rem", marginBottom: "0.4rem" }} alt="" />
                    <Link to={`/${product?.genre?.category}/${product?.genre?.sub_category}/${product?.genre?.post_category}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
                  </div>
               )
            })
         }
      </div>
   );
};

export default SearchPage;
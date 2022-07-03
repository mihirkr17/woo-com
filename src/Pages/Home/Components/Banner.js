import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Banner = ({ data }) => {
   const [randomProduct, setRandomProduct] = useState([]);

   useEffect(() => {
      let p = [];
      if (data) {
         for (let i = 0; i < 3; i++) {
            let idx = Math.floor(Math.random() * data.length);
            p.push(data[idx]);
            data.splice(idx, 1);
         }
         setRandomProduct(p);
      }
   }, [data])

   return (
      <div className="section_default">
         <Carousel>
            {
               randomProduct && randomProduct.map((d, i) => {
                  const productDiscount = d?.discount || 0;
                  const dis = (productDiscount / 100) * d?.price;
                  const finalPrice = d?.price - dis;
                  return (
                     <Carousel.Item key={i} style={{ height: "60vh" }}>
                        <div className="row  h-100">
                           <div className="col-lg-6 text-dark d-flex h-100 align-items-center justify-content-end">
                              <div className="px-5 text-end">
                                 <small><strike>{d?.price}$</strike> - <span>{d?.discount || 0}% Off</span></small>&nbsp;
                                 <big className='text-success fw-bold fs-2'>{finalPrice.toFixed(2)}$</big>
                                 <p>{d?.title}</p>
                                 <Link to={`/product/${d?._id}`} className='btn btn-info'>Shop Now</Link>
                              </div>
                           </div>
                           <div className="col-lg-6">
                              <img
                                 className="w-100 h-100"
                                 src={d?.image}
                                 alt="slide"
                              />
                           </div>
                        </div>
                     </Carousel.Item>
                  )
               })
            }
         </Carousel>
      </div>
   );
};

export default Banner;
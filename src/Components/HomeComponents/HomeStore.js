import React from 'react';
import { Row } from 'react-bootstrap';
import { useFetch } from '../../Hooks/useFetch';
import Spinner from '../Shared/Spinner/Spinner';
import Product from './HomeStoreComponents/Product';

const HomeStore = () => {
   const { data, loading } = useFetch('http://localhost:5000/products/');

   if (loading) return <Spinner></Spinner>;

   return (
      <section className='section_default'>
         <h2 className="section_title">Our Product <p>Drive Into Best</p></h2>
         <Row>
            {
               data && data.map(product => {
                  return (
                     <div className="col-lg-3 my-3" key={product._id}>
                        <Product product={product}></Product>
                     </div>
                  )
               })
            }
         </Row>
      </section>
   );
};

export default HomeStore;
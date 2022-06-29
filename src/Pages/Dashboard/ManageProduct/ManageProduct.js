import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useFetch } from '../../../Hooks/useFetch';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import { useAuthUser } from '../../../lib/UserProvider';

const ManageProduct = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const { role } = useAuth(user);
   const [product, setProduct] = useState([]);
   const [items, setItems] = useState(0);
   const [page, setPage] = useState(0);
   let url2 = role && role === "admin" ? `${BASE_URL}api/product-count?email=${user?.email}` :
      `${BASE_URL}api/product-count`
   const { data: counter } = useFetch(url2);
   let url = role && role === "admin" ? `${BASE_URL}api/products?email=${user?.email}&page=${page}&items=${5}` :
      `${BASE_URL}api/products?page=${page}&items=${5}`;
   const { data: products } = useFetch(url);

   useEffect(() => {
      setProduct(products);
   }, [products]);

   // product count 
   useEffect(() => {
      if (counter) {
         const pages = Math.ceil(counter?.count / 5)
         setItems(pages);
      }
   }, [counter]);



   return (
      <div className='section_default'>
         <div className="container">
            <table className='table'>
               <thead>
                  <tr>
                     <th>Title</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {product && product.map((p, index) => {
                     return (
                        <tr key={index}>
                           <td>{p?.title}</td>
                           <td>
                              <button className="btn btn-sm btn-info me-2">Edit</button>
                              <button className='btn btn-sm btn-danger'>Delete</button>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
            {
               <div className="py-3 text-center">
                  {
                     [...Array(items).keys()].map((p, i) => {
                        return (
                           <button onClick={() => setPage(p)} className={`btn btn-sm ${page === p ? "btn-warning" : ""}`} key={i}>{p + 1}</button>
                        )
                     })
                  }
               </div>
            }
         </div>
      </div>
   );
};

export default ManageProduct;
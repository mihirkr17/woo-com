import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase.init';
import useAuth from '../../../Hooks/useAuth';
import { useFetch } from '../../../Hooks/useFetch';

const ManageProduct = () => {
   const [user] = useAuthState(auth);
   const { role } = useAuth(user);
   const [product, setProduct] = useState([]);
   const [items, setItems] = useState(0);
   const [page, setPage] = useState(0);
   const [url2, setUrl2] = useState("");
   const { data: counter } = useFetch(url2);
   const [url, setUrl] = useState("");
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


   useEffect(() => {
      setUrl(
         role && role === "admin" ? `https://woo-com-serve.herokuapp.com/api/products?email=${user?.email}&page=${page}&items=${5}` :
            `https://woo-com-serve.herokuapp.com/api/products?page=${page}&items=${5}`
      );
   }, [items, page, role, user?.email]);


   useEffect(() => {
      setUrl2(
         role && role === "admin" ? `https://woo-com-serve.herokuapp.com/api/product-count?email=${user?.email}` :
            `https://woo-com-serve.herokuapp.com/api/product-count`
      );
   }, [items, page, role, user?.email]);



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
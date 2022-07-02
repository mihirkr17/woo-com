import React, { useState, useEffect } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import useAuth from '../../../Hooks/useAuth';
import { useFetch } from '../../../Hooks/useFetch';
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import { useAuthUser } from '../../../lib/UserProvider';
import FilterOption from '../../../Shared/FilterOption';
import { useMessage } from '../../../Hooks/useMessage';

const ManageProduct = () => {
   const { msg, setMessage } = useMessage();
   const BASE_URL = 'http://localhost:5000/' //useBASE_URL(); //
   const user = useAuthUser();
   const { role } = useAuth(user);
   const [items, setItems] = useState(0);
   const [page, setPage] = useState(0);
   const [url, setUrl] = useState("");
   let url2 = role && role === "admin" ? `${BASE_URL}api/product-count?email=${user?.email}` :
      `${BASE_URL}api/product-count`
   const { data: counter, refetch: counterRefetch } = useFetch(url2);
   const { data: products, loading, refetch } = useFetch(url);
   const [searchValue, setSearchValue] = useState("");
   const [filterCategory, setFilterCategory] = useState("all");

   useEffect(() => {
      let url;
      const setTimeUrl = setTimeout(() => {
         if (role && role === "admin") {
            url = `${BASE_URL}api/manage-product?email=${user?.email}&page=${page}&items=${8}&category=${filterCategory}&search=${searchValue}`
         } else {
            url = `${BASE_URL}api/manage-product?page=${page}&items=${8}&category=${filterCategory}&search=${searchValue}`
         }
         setUrl(url);
      }, 200);
      return () => clearTimeout(setTimeUrl);
   }, [BASE_URL, role, page, user?.email, searchValue, filterCategory]);

   useEffect(() => {
      if (searchValue.length > 0 || filterCategory !== "all") {
         setItems(1);
      } else {
         const pages = counter && Math.ceil(counter?.count / 8);
         setItems(pages);
      }
   }, [counter, searchValue, filterCategory]);

   const categories = ["all", "men's clothing", "women's clothing", "jewelry", "electronics"];

   // delete product
   const productDeleteHandler = async (productId) => {
      if (window.confirm("Want to delete this product ?")) {
         const response = await fetch(`${BASE_URL}api/delete-product/${productId}`, {
            method: "DELETE"
         });

         if (response.ok) {
            const resData = await response.json();
            refetch();
            counterRefetch();
            setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <div className="product_header">
               <div className="pt-2 pb-4 d-flex justify-content-between align-items-center flex-wrap">
                  <h5>My Products</h5>
                  <div>
                     <span>Filter By :&nbsp;</span>
                     <FilterOption options={categories} filterHandler={setFilterCategory} />
                  </div>

                  <div>
                     <input type="search" className='form-control form-control-sm' placeholder='Search product by name...' onChange={(e) => setSearchValue(e.target.value)} />
                  </div>
               </div>
               {msg}
            </div>

            {
               loading ? <Spinner /> :
                  <>
                     <table className='table table-responsive'>
                        <thead>
                           <tr>
                              <th>Product</th>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Seller</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {products && products.map((p, index) => {
                              return (
                                 <tr key={index}>
                                    <td>{
                                       <img src={p?.image} style={{ width: "45px", height: "45px" }} alt="" />
                                    }</td>
                                    <td>{p?.title}</td>
                                    <td>{p?.category}</td>
                                    <td>{p?.seller}</td>
                                    <td>
                                       <button className="btn btn-sm btn-info me-2">Edit</button>
                                       <button className='btn btn-sm btn-danger' onClick={() => productDeleteHandler(p?._id)}>Delete</button>
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </table>
                     {
                        <div className="py-3 text-center">
                           {
                              items >= 0 ? [...Array(items).keys()].map((p, i) => {
                                 return (
                                    <button onClick={() => setPage(p)} className={`btn btn-sm ${page === p ? "btn-warning" : ""}`} key={i}>{p + 1}</button>
                                 )
                              }) : ""
                           }
                        </div>
                     }
                  </>
            }
         </div>

      </div>
   );
};

export default ManageProduct;
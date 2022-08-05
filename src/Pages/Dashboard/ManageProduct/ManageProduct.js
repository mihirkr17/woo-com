import React, { useState, useEffect } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import useAuth from '../../../Hooks/useAuth';
import { useFetch } from '../../../Hooks/useFetch';

import FilterOption from '../../../Shared/FilterOption';
import { useMessage } from '../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductDetailsModal from './Components/ProductDetailsModal';
import ProductUpdateModal from './Components/ProductUpdateModal';
import { Table } from 'react-bootstrap';
import { useAuthUser } from '../../../App';

const ManageProduct = () => {
   const { msg, setMessage } = useMessage();

   const user = useAuthUser();
   const { role, userInfo } = useAuth(user);
   const [items, setItems] = useState(0);
   const [page, setPage] = useState(0);
   const [url, setUrl] = useState("");
   let url2 = userInfo && userInfo?.seller ? `${process.env.REACT_APP_BASE_URL}api/product-count?seller=${userInfo?.seller}` :
      `${process.env.REACT_APP_BASE_URL}api/product-count`
   const { data: counter, refetch: counterRefetch } = useFetch(url2);
   const { data: products, loading, refetch } = useFetch(url);
   const [searchValue, setSearchValue] = useState("");
   const [filterCategory, setFilterCategory] = useState("all");
   const [openModal, setOpenModal] = useState(false);
   const [productDetailsModal, setProductDetailsModal] = useState(false);

   useEffect(() => {
      let url;
      const setTimeUrl = setTimeout(() => {
         if (userInfo?.seller) {
            url = `${process.env.REACT_APP_BASE_URL}api/manage-product?seller=${userInfo?.seller}&page=${page}&items=${8}&category=${filterCategory}&search=${searchValue}`
         } else {
            url = `${process.env.REACT_APP_BASE_URL}api/manage-product?page=${page}&items=${8}&category=${filterCategory}&search=${searchValue}`
         }
         setUrl(url);
      }, 200);
      return () => clearTimeout(setTimeUrl);
   }, [page, userInfo?.seller, searchValue, filterCategory]);

   useEffect(() => {
      if (searchValue.length > 0 || filterCategory !== "all") {
         setItems(1);
      } else {
         const pages = counter && Math.ceil(counter?.count / 8);
         setItems(pages);
      }
   }, [counter, searchValue, filterCategory]);

   const categories = ["all", "men's-clothing", "women's-clothing", "jewelry", "electronics"];

   // delete product
   const productDeleteHandler = async (productId) => {
      if (window.confirm("Want to delete this product ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/delete-product/${productId}`, {
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
               <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h5 className='py-3'>My Products</h5>
                  <div className='py-3'>
                     <span>Filter By :&nbsp;</span>
                     <FilterOption options={categories} filterHandler={setFilterCategory} />
                  </div>

                  <div className='py-3'>
                     <input type="search" className='form-control form-control-sm' placeholder='Search product by name...' onChange={(e) => setSearchValue(e.target.value)} />
                  </div>
               </div>
               {msg}
            </div>

            {
               loading ? <Spinner /> :
                  <>
                     <Table responsive>
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
                                    <td><p style={{ cursor: "pointer" }} title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>{p?.title.length > 50 ? p?.title.slice(0, 50) + "..." : p?.title}</p></td>
                                    <td>{p?.category}</td>
                                    <td>{p?.seller}</td>
                                    <td>
                                       <button className="btn btn-sm m-1" title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                          <FontAwesomeIcon icon={faEye} />
                                       </button>
                                       <button className="btn btn-sm m-1" title={`Update ${p?.title}`} onClick={() => setOpenModal(true && p)}>
                                          <FontAwesomeIcon icon={faPenAlt} />
                                       </button>
                                       <button className='btn btn-sm m-1' title={`Delete ${p?.title}`} onClick={() => productDeleteHandler(p?._id)}>
                                          <FontAwesomeIcon icon={faTrashAlt} />
                                       </button>
                                    </td>
                                 </tr>
                              )
                           })}
                        </tbody>
                     </Table>
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
                     <ProductUpdateModal
                        modalOpen={openModal}
                        modalClose={() => setOpenModal(false)}
                        refetch={refetch}
                        setMessage={setMessage}
                     />
                     <ProductDetailsModal
                        modalOpen={productDetailsModal}
                        modalClose={() => setProductDetailsModal(false)}
                     />
                  </>
            }

         </div>

      </div>
   );
};

export default ManageProduct;
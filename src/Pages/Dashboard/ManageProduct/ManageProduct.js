import React, { useState, useEffect } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useMessage } from '../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductDetailsModal from './Components/ProductDetailsModal';
import { useAuthContext } from '../../../lib/AuthProvider';
import { loggedOut } from '../../../Shared/common';
import { Link, useNavigate } from 'react-router-dom';
import ProductTemplateForm from './Components/ProductTemplateForm';
import { newCategory } from '../../../Assets/CustomData/categories';
import ProductUpdate from './Components/ProductUpdate';

const ManageProduct = () => {
   const { msg, setMessage } = useMessage();
   const { userInfo, role } = useAuthContext();
   const [items, setItems] = useState(1);
   const [url, setUrl] = useState("");
   let url2 = role === "seller" ? `${process.env.REACT_APP_BASE_URL}api/product/product-count?seller=${userInfo?.seller}` :
      `${process.env.REACT_APP_BASE_URL}api/product/product-count`
   const { data: counter, refetch: counterRefetch } = useFetch(url2);
   const { data: products, loading, refetch } = useFetch(url);
   const [searchValue, setSearchValue] = useState("");
   const [filterCategory, setFilterCategory] = useState("all");
   const [productDetailsModal, setProductDetailsModal] = useState(false);
   const navigate = useNavigate();

   // search query params
   const queryParams = new URLSearchParams(window.location.search).get("np");
   const querySeller = new URLSearchParams(window.location.search).get("s");
   const queryPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

   useEffect(() => {
      let url;
      const setTimeUrl = setTimeout(() => {
         if (userInfo?.seller) {
            url = `${process.env.REACT_APP_BASE_URL}api/product/manage-product?seller=${userInfo?.seller}&page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`
         } else {
            url = `${process.env.REACT_APP_BASE_URL}api/product/manage-product?page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`
         }
         setUrl(url);
      }, 200);
      return () => clearTimeout(setTimeUrl);
   }, [queryPage, userInfo?.seller, searchValue, filterCategory]);

   useEffect(() => {
      if (searchValue.length > 0 || filterCategory !== "all") {
         setItems(1);
      } else {
         const pages = counter && Math.ceil(counter?.count / 8);
         setItems(pages);
      }
   }, [counter, searchValue, filterCategory]);

   // delete product
   const productDeleteHandler = async (productId) => {
      if (window.confirm("Want to delete this product ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/delete-product/${productId}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include"
         });
         const resData = await response.json();

         if (response.ok) {
            refetch();
            counterRefetch();
            setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
         } else {
            await loggedOut();
            navigate(`/login?err=${resData?.error}`)
         }
      }
   }

   let pageBtn = [];

   for (let i = 1; i <= items; i++) {
      pageBtn.push(i);
   }

   const stockHandler = async (e, productId) => {
      const { value } = e.target;
      let available = parseInt(value);

      try {

         setTimeout(async () => {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/update-stock`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  authorization: `${productId}`
               },
               withCredentials: true,
               credentials: "include",
               body: JSON.stringify({ available })
            });

            const resData = await response.json();
            if (response.ok) {
               resData && setMessage(<p className='text-success'><strong>Stock updated successfully</strong></p>);
               refetch();
            } else {
               await loggedOut();
               navigate(`login?err=${resData?.error}`);
            }
         }, 400)
      } catch (error) {
         setMessage(error?.message);
      }
   }

   return (

      <div className='section_default'>
         <div className="container">
            {
               (queryParams === "add_product" && querySeller === userInfo?.seller) ?
                  <>
                     <h6>Add New Product</h6>
                     <button className='bt9_edit' onClick={() => navigate('/dashboard/manage-product')}>Cancel</button>
                     <ProductTemplateForm userInfo={userInfo} formTypes={"create"} />
                  </> : (queryParams === "edit_product" && querySeller === userInfo?.seller) ?
                     <>
                        <h6>Edit This Product</h6>
                        <button className='bt9_edit' onClick={() => navigate('/dashboard/manage-product')}>Cancel</button>
                        <ProductUpdate userInfo={userInfo} setMessage={setMessage} />
                     </> :
                     <>
                        <div className="product_header">

                           <div className="d-flex justify-content-between align-items-center flex-wrap">
                              <h5 className='py-3'>{role === "seller" ? "My Products (" + counter?.count + ")" : "All Products (" + counter?.count + ")"}</h5>
                              <div className='py-3'>

                                 <select name="filter_product" style={{ textTransform: "capitalize" }} className='form-select form-select-sm' onChange={e => setFilterCategory(e.target.value)}>
                                    <option value="all">All</option>
                                    {
                                       newCategory && newCategory.map((opt, index) => {
                                          return (
                                             <option value={opt?.category} key={index}>{opt?.category}</option>
                                          )
                                       })
                                    }
                                 </select>
                              </div>

                              <div className='py-3'>
                                 <input type="search" className='form-control form-control-sm' placeholder='Search product by name...' onChange={(e) => setSearchValue(e.target.value)} />
                              </div>
                              {
                                 (role === "seller") &&
                                 <Link className='bt9_edit' to={`/dashboard/manage-product?np=add_product&s=${userInfo?.seller}`}>Add a new product</Link>

                              }
                           </div>
                           {msg}
                        </div>

                        {
                           loading ? <Spinner /> :
                              <div className='table-responsive'>
                                 <table className='table table-striped table-bordered'>
                                    <thead>
                                       <tr>
                                          {/* <th>Product</th> */}
                                          <th>Title</th>
                                          <th>Price</th>
                                          <th>Selling Price</th>
                                          <th>Discount</th>
                                          <th>Stock</th>
                                          <th>Category</th>
                                          <th>Seller</th>
                                          <th>Action</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {products && products.map((p, index) => {

                                          const { genre, available, pricing, sku } = p;
                                          return (
                                             <tr key={index}>
                                                <td>
                                                   <div className="d-flex flex-row align-items-center justify-content-start">
                                                      <img src={p?.image[0]} style={{ width: "35px", height: "35px" }} alt="" />
                                                      <p style={{ cursor: "pointer", marginLeft: "0.6rem" }} title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                                         {p?.title.length > 50 ? p?.title.slice(0, 50) + "..." : p?.title} <br />
                                                         <small>SKU ID: {sku}</small>
                                                      </p>
                                                   </div>
                                                </td>
                                                <td>
                                                   {pricing?.price} Tk
                                                </td>
                                                <td>
                                                   {pricing?.sellingPrice} Tk

                                                </td>
                                                <td>
                                                   {pricing?.discount} %
                                                </td>
                                                <td>
                                                   <input type="text" style={{ width: "50px", border: "none", backgroundColor: "inherit" }} onChange={(e) => stockHandler(e, p?._id)} defaultValue={available} readOnly onDoubleClick={e => e.target.readOnly = false} />
                                                </td>
                                                <td>{genre?.category}</td>
                                                <td>{p?.seller}</td>
                                                <td>
                                                   <button className="btn btn-sm m-1" title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                                      <FontAwesomeIcon icon={faEye} />
                                                   </button>
                                                   <Link className='bt9_edit' to={`/dashboard/manage-product?np=edit_product&s=${p?.seller}&pid=${p?._id}`}>
                                                      <FontAwesomeIcon icon={faPenToSquare} />
                                                   </Link>
                                                   {/* <button className="btn btn-sm m-1" title={`Update ${p?.title}`} onClick={() => setOpenModal(true && p)}>
                                                   <FontAwesomeIcon icon={faPenToSquare} />
                                                </button> */}
                                                   <button className='btn btn-sm m-1' title={`Delete ${p?.title}`} onClick={() => productDeleteHandler(p?._id)}>
                                                      <FontAwesomeIcon icon={faTrashAlt} />
                                                   </button>
                                                </td>
                                             </tr>
                                          )
                                       })}
                                    </tbody>
                                 </table>
                                 {
                                    <div className="py-3 text-center pagination_system">
                                       <ul className='pagination justify-content-center pagination-sm'>
                                          {
                                             queryPage >= 2 && <li className='page-item'><Link className='page-link' to={`/dashboard/manage-product?page=${queryPage - 1}`}>Prev</Link></li>
                                          }

                                          {
                                             items >= 0 ? pageBtn.map((p, i) => {
                                                return (
                                                   <li className='page-item' key={i}><Link className='page-link' to={`/dashboard/manage-product?page=${p}`}>{p}</Link></li>
                                                )
                                             }) : ""
                                          }
                                          {
                                             queryPage < items && <li className='page-item'><Link className='page-link' to={`/dashboard/manage-product?page=${queryPage + 1}`}>Next</Link></li>
                                          }
                                       </ul>


                                    </div>
                                 }
                                 <ProductDetailsModal
                                    modalOpen={productDetailsModal}
                                    modalClose={() => setProductDetailsModal(false)}
                                    showFor={role}
                                 />
                              </div>
                        }
                     </>
            }

         </div>

      </div>
   );
};

export default ManageProduct;
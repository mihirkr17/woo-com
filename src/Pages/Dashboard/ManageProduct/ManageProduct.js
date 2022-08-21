import React, { useState, useEffect } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useMessage } from '../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenAlt, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductDetailsModal from './Components/ProductDetailsModal';
import ProductUpdateModal from './Components/ProductUpdateModal';
import { Table } from 'react-bootstrap';
import { useAuthContext } from '../../../lib/AuthProvider';
import { loggedOut } from '../../../Shared/common';
import { Link, useNavigate } from 'react-router-dom';
import ProductTemplateForm from '../../../Shared/ProductTemplateForm';
import { newCategory } from '../../../Assets/CustomData/categories';

const ManageProduct = () => {
   const { msg, setMessage } = useMessage();
   const { userInfo, role } = useAuthContext();
   const [items, setItems] = useState(1);
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
   const navigate = useNavigate();

   // search query params
   const queryParams = new URLSearchParams(window.location.search).get("np");
   const querySeller = new URLSearchParams(window.location.search).get("s");
   const queryPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;



   useEffect(() => {
      let url;
      const setTimeUrl = setTimeout(() => {
         if (userInfo?.seller) {
            url = `${process.env.REACT_APP_BASE_URL}api/manage-product?seller=${userInfo?.seller}&page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`
         } else {
            url = `${process.env.REACT_APP_BASE_URL}api/manage-product?page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`
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
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/delete-product/${productId}`, {
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
            navigate(`/login?err=${resData?.message} token not found`)
         }
      }
   }

   let pageBtn = [];

   for (let i = 1; i <= items; i++) {
      pageBtn.push(i);
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
                  </> :
                  <>
                     <div className="product_header">

                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                           <h5 className='py-3'>{role === "seller" ? "My Products" : "All Products (" + counter?.count + ")"}</h5>
                           <div className='py-3'>

                              <select name="filter_product" style={{ textTransform: "capitalize" }} className='form-select form-select-sm' onChange={e => setFilterCategory(e.target.value)}>
                                 <option value="all">Choose...</option>
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

                                       const { genre } = p;
                                       return (
                                          <tr key={index}>
                                             <td>{
                                                <img src={p?.image[0]} style={{ width: "45px", height: "45px" }} alt="" />
                                             }</td>
                                             <td><p style={{ cursor: "pointer" }} title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>{p?.title.length > 50 ? p?.title.slice(0, 50) + "..." : p?.title}</p></td>
                                             <td>{genre?.category}</td>
                                             <td>{p?.seller}</td>
                                             <td>
                                                <button className="btn btn-sm m-1" title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                                   <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="btn btn-sm m-1" title={`Update ${p?.title}`} onClick={() => setOpenModal(true && p)}>
                                                   <FontAwesomeIcon icon={faPenToSquare} />
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
                              <ProductUpdateModal
                                 modalOpen={openModal}
                                 modalClose={() => setOpenModal(false)}
                                 refetch={refetch}
                                 setMessage={setMessage}
                              />
                              <ProductDetailsModal
                                 modalOpen={productDetailsModal}
                                 modalClose={() => setProductDetailsModal(false)}
                                 showFor={role}
                              />
                           </>
                     }
                  </>
            }

         </div>

      </div>
   );
};

export default ManageProduct;
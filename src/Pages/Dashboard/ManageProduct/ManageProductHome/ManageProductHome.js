import React from 'react';
import { Link } from 'react-router-dom';

const ManageProductHome = (
   {
      refetch,
      setMessage,
      newCategory,
      role,
      counter,
      loading,
      productDetailsModal,
      manageProducts,
      msg,
      setSearchValue,
      setFilterCategory,
      setProductDetailsModal,
      navigate,
      authLogout,
      counterRefetch,
      queryPage,
      items,
      pageBtn,
      location,
      faEye,
      faPenToSquare,
      faTrashAlt,
      FontAwesomeIcon,
      Spinner,
      ProductDetailsModal
   }
) => {


   const deleteProductVariationHandler = async (vid, pid) => {
      try {

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/delete-product-variation/${pid}/${vid}`, {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include'
         });

         const resData = await response.json();

         if (response.ok) {
            refetch();
            return;
         }

         setMessage(resData?.error, 'danger');
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }


   const productDeleteHandler = async (productId) => {
      if (window.confirm("Want to delete this product ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/delete-product`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
            headers: {
               authorization: productId
            }
         });
         const resData = await response.json();

         if (response.status === 401 || response.status === 403) {
            await authLogout();
            navigate(`/login?err=${resData?.error}`)
         }

         if (response.ok) {
            refetch();
            counterRefetch();
            setMessage(resData?.message, 'success');
         }
      }
   }


   const stockHandler = async (e, productId) => {
      const { value } = e.target;

      let available = parseInt(value);


      try {
         // if (e.key === 'Enter') {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/update-stock`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: productId
            },
            body: JSON.stringify({ available })
         });

         const resData = await response.json();

         if (response.status === 401 || response.status === 403) {
            await authLogout();
            navigate(`login?err=${resData?.error}`);
         }

         if (response.ok) {
            resData && setMessage(resData?.message, 'success');
            refetch();
         }
         // }

      } catch (error) {
         setMessage(error?.message);
      }
   }


   async function productControlHandler(action, lId, pId, vId) {
      try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/product/product-control`, {
            method: "PUT",
            withCredentials: true,
            credentials: 'include',
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ market_place: 'woo-kart', actionType: action, data: { action, lId, pId, vId } })
         });

         const data = await response.json();

         if (data) {
            refetch();
            setMessage(data?.message);
         }


      } catch (error) {
         setMessage(error?.error);
      }
   }
   return (
      <>
         <div className="product_header">

            <div className="d-flex justify-content-between align-items-center flex-wrap">
               <h5 className='py-3'>{role === 'SELLER' ? "My Products (" + counter?.count + ")" : "All Products (" + counter?.count + ")"}</h5>
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
                        {manageProducts?.data?.products && manageProducts?.data?.products.map((p, index) => {

                           const { categories, variations } = p;
                           return (
                              <tr key={index}>
                                 <td>
                                    <div className="d-flex flex-row align-items-center justify-content-start">
                                       <img src={variations?.images && variations?.images[0]} style={{ width: "35px", height: "35px" }} alt="" />
                                       <p style={{ cursor: "pointer", marginLeft: "0.6rem" }} title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                          {p?.title.length > 50 ? p?.title.slice(0, 50) + "..." : p?.title} <br />
                                          <small>SKU ID: {variations?.sku}</small>
                                       </p>
                                    </div>
                                 </td>
                                 <td>
                                    {variations?.pricing?.price} Tk
                                 </td>
                                 <td>
                                    {variations?.pricing?.sellingPrice} Tk
                                 </td>
                                 <td>
                                    {variations?.pricing?.discount} %
                                 </td>
                                 <td>
                                    {
                                       role === 'SELLER' ?

                                          <input type="text" style={{ width: "50px", border: "none", backgroundColor: "inherit" }}
                                             onBlur={(e) => stockHandler(e, p?._id)}
                                             defaultValue={variations?.available}
                                             readOnly onDoubleClick={e => e.target.readOnly = false} /> :
                                          p?.stockInfo?.available
                                    }
                                 </td>
                                 <td>{p?.categories && p?.categories[0]}</td>
                                 <td>{p?.seller?.name}</td>
                                 <td>
                                    {
                                       <>
                                          {
                                             variations?.status === 'active' &&
                                             <button className='bt9_edit me-2'
                                                onClick={() => productControlHandler("inactive", p?._lId, p?._id, variations?._vId)}
                                             >Inactive</button>
                                          }
                                       </>

                                    }
                                    {
                                       <>
                                          {
                                             p?.save_as === 'fulfilled' &&
                                             <button className='bt9_edit me-2'
                                                onClick={() => productControlHandler("draft", p?._lId, p?._id)}
                                             >Hide</button>
                                          }
                                       </>

                                    }
                                    <button className="btn btn-sm m-1" title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                       <FontAwesomeIcon icon={faEye} />
                                    </button>

                                    {
                                       role === 'SELLER' &&
                                       <Link className='bt9_edit' to={`/dashboard/manage-product?np=edit_product&s=${p?.seller?.name}&pid=${p?._id}`}>
                                          <FontAwesomeIcon icon={faPenToSquare} />
                                       </Link>
                                    }
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

         {/* Inactive products  */}
         <div className="mt-3">
            <h6>Inactive Products</h6>
            <div className="card_default card_description">
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
                        {
                           manageProducts?.data?.inactiveProduct && manageProducts?.data?.inactiveProduct.map((p, index) => {
                              const { categories, variations } = p;

                              return (
                                 <tr key={index}>
                                    <td>
                                       <div className="d-flex flex-row align-items-center justify-content-start">
                                          <img src={variations?.images && variations?.images[0]} style={{ width: "35px", height: "35px" }} alt="" />
                                          <p style={{ cursor: "pointer", marginLeft: "0.6rem" }} title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                             {p?.title.length > 50 ? p?.title.slice(0, 50) + "..." : p?.title} <br />
                                             <small>SKU ID: {variations?.sku}</small>
                                          </p>
                                       </div>
                                    </td>
                                    <td>
                                       {variations?.pricing?.price} Tk
                                    </td>
                                    <td>
                                       {variations?.pricing?.sellingPrice} Tk
                                    </td>
                                    <td>
                                       {variations?.pricing?.discount} %
                                    </td>
                                    <td>
                                       {
                                          role === 'SELLER' ?

                                             <input type="text" style={{ width: "50px", border: "none", backgroundColor: "inherit" }}
                                                onBlur={(e) => stockHandler(e, p?._id)}
                                                defaultValue={variations?.available}
                                                readOnly onDoubleClick={e => e.target.readOnly = false} /> :
                                             p?.stockInfo?.available
                                       }
                                    </td>
                                    <td>{p?.categories && p?.categories[0]}</td>
                                    <td>{p?.seller?.name}</td>
                                    <td>
                                       {
                                          <>
                                             {
                                                variations?.status === 'inactive' &&
                                                <button className='bt9_edit me-2'
                                                   onClick={() => productControlHandler("active", p?._lId, p?._id, variations?._vId)}
                                                >Active</button>
                                             }
                                          </>

                                       }
                                       <button className="btn btn-sm m-1" title={`View ${p?.title}`} onClick={() => setProductDetailsModal(true && p)}>
                                          <FontAwesomeIcon icon={faEye} />
                                       </button>

                                       {
                                          role === 'SELLER' &&
                                          <Link className='bt9_edit' to={`/dashboard/manage-product?np=edit_product&s=${p?.seller?.name}&pid=${p?._id}`}>
                                             <FontAwesomeIcon icon={faPenToSquare} />
                                          </Link>
                                       }
                                       <button className='btn btn-sm m-1' title={`Delete ${p?.title}`} onClick={() => productDeleteHandler(p?._id)}>
                                          <FontAwesomeIcon icon={faTrashAlt} />
                                       </button>
                                    </td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>


               </div>
            </div>
         </div>



         {
            role === 'SELLER' &&
            <div className="mt-3">
               <h6>Draft Products</h6>

               <div className="card_default card_description">

                  {
                     manageProducts?.data?.draftProducts ? manageProducts?.data?.draftProducts.map((mProduct, index) => {
                        return (
                           <div className='border my-3' key={index}>

                              {
                                 mProduct?.variations && mProduct?.variations.length >= 0 ?
                                    <>
                                       <div className="d-flex align-items-center justify-content-between p-2">
                                          <small>
                                             <pre>
                                                PID   : {mProduct?._id} <br />
                                                BRAND : {mProduct?.brand}
                                             </pre>
                                          </small>
                                          <div className="px-3">

                                             <Link className='bt9_edit' state={{ from: location }} replace
                                                to={`/dashboard/manage-product?np=edit_product&s=${mProduct?.seller?.name}&pid=${mProduct?._id}`}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                &nbsp;Edit Product
                                             </Link>
                                             &nbsp;

                                             &nbsp;
                                             <Link className='bt9_edit me-2' state={{ from: location }} replace to={`/dashboard/manage-product?np=add-new-variation&s=${mProduct?.seller?.name}&pid=${mProduct?._id}`}>
                                                Add New Variation
                                             </Link>
                                          </div>
                                       </div>

                                       <table className='table '>
                                          <thead>
                                             <tr>
                                                <th>Product</th>
                                                <th>Size</th>
                                                <th>Action</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {
                                                mProduct?.variations ? mProduct?.variations.map(product => {

                                                   return (
                                                      <tr key={product?.vId}>
                                                         <td>
                                                            <small>VID: {product?.vId}</small>
                                                            <br />
                                                            <small>SKU: {product?.sku}</small>
                                                         </td>
                                                         <td>{product?.size}</td>
                                                         <td>

                                                            {
                                                               mProduct?.save_as === 'draft' &&
                                                               <button className='bt9_edit me-2'
                                                                  onClick={() => productControlHandler("fulfilled", mProduct?._lId, mProduct?._id)}
                                                               >
                                                                  Publish
                                                               </button>
                                                            }

                                                            <Link className='bt9_edit' state={{ from: location }} replace
                                                               to={`/dashboard/manage-product?np=update-variation&s=${mProduct?.seller?.name}&pid=${mProduct?._id}&vId=${product?._vId}`}>
                                                               Update Variation
                                                            </Link>

                                                            <button className='btn btn-sm m-1' title={`Delete ${mProduct?.title}`}
                                                               onClick={() => deleteProductVariationHandler(product?._vId, mProduct?._id)}>
                                                               <FontAwesomeIcon icon={faTrashAlt} />
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   )
                                                }) : <tr><td>No product in your drafts</td></tr>
                                             }
                                          </tbody>
                                       </table>
                                    </> : <div className="d-flex align-items-center justify-content-between p-2">
                                       <small>
                                          <pre>
                                             Title : {mProduct?.title} <br />
                                             PID   : {mProduct?._id} <br />
                                             BRAND : {mProduct?.brand}
                                          </pre>
                                       </small>

                                       <div className="p-1">


                                          {
                                             mProduct.variations && mProduct.variations.length >= 1 && <>
                                                {
                                                   mProduct?.save_as === 'draft' &&
                                                   <button className='bt9_edit me-2'
                                                      onClick={() => productControlHandler("fulfilled", mProduct?._lId, mProduct?._id)}
                                                   >Publish</button>
                                                }
                                             </>

                                          }

                                          <Link className='bt9_edit me-2' state={{ from: location }} replace
                                             to={`/dashboard/manage-product?np=add-new-variation&s=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                                             Create Variation
                                          </Link>
                                       </div>
                                    </div>
                              }
                           </div>
                        )
                     }) : <p>Add Variation</p>
                  }

               </div>



            </div>
         }
      </>
   );
};

export default ManageProductHome;
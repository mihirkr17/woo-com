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
      setSearchValue,
      setFilterCategory,
      setProductDetailsModal,
      navigate,
      // counterRefetch,
      queryPage,
      items,
      pageBtn,
      location,
      faEye,
      faPenToSquare,
      faTrashAlt,
      FontAwesomeIcon,
      Spinner,
      ProductDetailsModal,
      userInfo
   }
) => {

   const deleteProductVariationHandler = async (vid, pid) => {
      try {

         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/seller/${userInfo?.seller?.storeInfos?.storeName}/product/delete-product-variation/${pid}/${vid}`, {
            method: 'DELETE',
            withCredentials: true,
            credentials: 'include'
         });

         const resData = await response.json();

         if (response.ok) {
            if (resData?.success) {
               refetch();
               return;
            }

            setMessage(resData?.message, 'danger');
         }

         setMessage(resData?.message, 'danger');
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }


   const deleteThisProductHandler = async (_id, _lId, storeName) => {
      if (window.confirm("Want to delete this product ?")) {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/${storeName}/product/delete-product`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
            headers: {
               authorization: _id + ',' + _lId
            }
         });
         const resData = await response.json();

         if (response.ok) {
            refetch();
            // counterRefetch();
            setMessage(resData?.message, 'success');
         }
      }
   }


   const stockHandler = async (e, productId, _vId) => {
      const { value } = e.target;

      let available = parseInt(value);

      try {
         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/seller/${userInfo?.seller?.storeInfos?.storeName}/product/update-stock`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: productId
            },
            body: JSON.stringify({ variations: { available, _vId }, MARKET_PLACE: 'WooKart' })
         });

         const resData = await response.json();

         if (response.ok) {
            resData && setMessage(resData?.message, 'success');
            refetch();
         }

      } catch (error) {
         setMessage(error?.message);
      }
   }


   async function productControlHandler(action, lId, pId, vId, mProduct) {
      try {

         if ((mProduct?.variations && mProduct?.variations.filter(v => v?.status === 'active').length <= 1) && (action === 'inactive')) {
            return setMessage("At least one variation need to active !", 'danger');
         }



         const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/dashboard/seller/${mProduct?.sellerData?.storeName}/product-control`, {
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
               <h5 className='py-3'>{role === 'SELLER' ? "Active Products (" + counter + ")" : "All Products (" + counter + ")"}</h5>
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
         </div>

         {
            loading ? <Spinner /> :
               manageProducts?.data?.products && manageProducts?.data?.products.map((mProduct, index) => {
                  return (
                     <div className='border my-3 card_default card_description' key={index}>
                        <div className='p-1'>
                           <small>
                              <pre>
                                 TITLE           : {mProduct?.title} <br />
                                 PID             : {mProduct?._id} <br />
                                 Listing ID      : {mProduct?._lId} <br />
                                 BRAND           : {mProduct?.brand} <br />
                                 CATEGORIES      : {mProduct?.categories && mProduct?.categories.join(" >> ")} <br />
                                 Total Variation : {(mProduct?.variations && mProduct?.variations.length) || 0}
                              </pre>
                           </small>

                           <Link className='bt9_edit' state={{ from: location }} replace
                              to={`/dashboard/manage-product?np=edit_product&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                              <FontAwesomeIcon icon={faPenToSquare} />
                              &nbsp;Edit Product
                           </Link>
                           &nbsp;&nbsp;
                           {
                              mProduct?.save_as === 'fulfilled' &&
                              <button className='bt9_cancel'
                                 onClick={() => productControlHandler("draft", mProduct?._lId, mProduct?._id)}
                              >
                                 Move To Draft
                              </button>
                           }

                           <Link className='bt9_create mx-2' state={{ from: location }} replace to={`/dashboard/manage-product?np=add-new-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                              Add New Variation
                           </Link>
                        </div>
                        <table className='table'>
                           <thead>
                              <tr>
                                 <th>Image</th>
                                 <th>_vId</th>
                                 <th>sku</th>
                                 <th>Status</th>
                                 <th>Price (Tk)</th>
                                 <th>Selling Pricing (Tk)</th>
                                 <th>Availability (Pcs)</th>
                                 <th>Stock</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {
                                 mProduct?.variations ? mProduct?.variations.map(variation => {

                                    return (
                                       <tr key={variation?._vId}>
                                          <td>
                                             <img src={variation?.images && variation?.images[0]} alt="" style={{ width: "60px", height: "60px" }} />
                                          </td>
                                          <td>{variation?._vId}</td>
                                          <td>{variation?.sku}</td>
                                          <td>{variation?.status.toUpperCase()}</td>
                                          <td>{variation?.pricing?.price}</td>
                                          <td>{variation?.pricing?.sellingPrice}</td>
                                          <td>
                                             {
                                                role === 'SELLER' ?
                                                   <input type="text" style={{ width: "50px", border: "1px solid black", backgroundColor: "inherit" }}
                                                      onBlur={(e) => stockHandler(e, mProduct?._id, variation?._vId)}
                                                      defaultValue={variation?.available}
                                                      readOnly onDoubleClick={e => e.target.readOnly = false} /> :
                                                   variation?.available

                                             }
                                          </td>
                                          <td>{variation?.stock}</td>
                                          <td>

                                             

                                             <button className={`me-2 ${variation?.status === 'active' ? 'bt9_warning' : 'bt9_edit'}`}
                                                onClick={() => productControlHandler(variation?.status === 'active' ? "inactive" : 'active', mProduct?._lId, mProduct?._id, variation?._vId, mProduct)}
                                             >
                                                {
                                                   variation?.status === 'active' ? 'Inactive Now' : 'Active Now'
                                                }
                                             </button> 
                                 


                                             <Link className='bt9_edit' state={{ from: location }} replace
                                                to={`/dashboard/manage-product?np=update-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}&vId=${variation?._vId}`}>
                                                Update Variation
                                             </Link>

                                             {
                                                mProduct?.variations && mProduct?.variations.length >= 2 && <button className='btn btn-sm m-1' title={`Delete ${mProduct?.title}`}
                                                   onClick={() => deleteProductVariationHandler(variation?._vId, mProduct?._id)}>
                                                   <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                             }
                                          </td>
                                       </tr>
                                    )
                                 }) : <tr><td>No product in your drafts</td></tr>
                              }
                           </tbody>
                        </table>
                     </div>
                  );
               }
               )
         }


         <div className="py-3 text-center pagination_system">
            <ul className='pagination justify-content-center pagination-sm'>
               {queryPage >= 2 && <li className='page-item'><Link className='page-link' to={`/dashboard/manage-product?page=${queryPage - 1}`}>Prev</Link></li>}

               {items >= 0 ? pageBtn.map((p, i) => {
                  return (
                     <li className='page-item' key={i}><Link className='page-link' to={`/dashboard/manage-product?page=${p}`}>{p}</Link></li>
                  );
               }) : ""}
               {queryPage < items && <li className='page-item'><Link className='page-link' to={`/dashboard/manage-product?page=${queryPage + 1}`}>Next</Link></li>}
            </ul>

            <ProductDetailsModal
               modalOpen={productDetailsModal}
               modalClose={() => setProductDetailsModal(false)}
               showFor={role} />

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
                              <div className='p-1'>
                                 <small>
                                    <pre>
                                       TITLE           : {mProduct?.title} <br />
                                       PID             : {mProduct?._id} <br />
                                       Listing ID      : {mProduct?._lId} <br />
                                       BRAND           : {mProduct?.brand} <br />
                                       CATEGORIES      : {mProduct?.categories && mProduct?.categories.join(" >> ")} <br />
                                       Total Variation : {(mProduct?.variations && mProduct?.variations.length) || 0}
                                    </pre>
                                 </small>

                                 <Link className='bt9_edit' state={{ from: location }} replace
                                    to={`/dashboard/manage-product?np=edit_product&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    &nbsp;Edit Product
                                 </Link>
                                 &nbsp;
                                 <button className='mt-2 bt9_delete' onClick={() => deleteThisProductHandler(mProduct?._id, mProduct?._lId, mProduct?.sellerData?.storeName)}>Delete This Product</button> &nbsp;
                                 {
                                    (Array.isArray(mProduct?.variations) && mProduct?.variations.length >= 1 && mProduct?.save_as === 'draft') ?
                                       <button className='bt9_edit me-2'
                                          onClick={() => productControlHandler("fulfilled", mProduct?._lId, mProduct?._id)}
                                       >
                                          Publish
                                       </button> : <p>Please Create at least one variation for publish this product</p>
                                 }
                              </div>

                              {
                                 mProduct?.variations && mProduct?.variations.length >= 0 ?
                                    <>
                                       <div className="px-1 pb-3">
                                          <Link className='bt9_create me-2' state={{ from: location }} replace to={`/dashboard/manage-product?np=add-new-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                                             Add New Variation
                                          </Link>
                                       </div>


                                       <table className='table '>
                                          <thead>
                                             <tr>
                                                <th>Image</th>
                                                <th>_vId</th>
                                                <th>sku</th>
                                                <th>Action</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {
                                                mProduct?.variations ? mProduct?.variations.map(variation => {

                                                   return (
                                                      <tr key={variation?._vId}>
                                                         <td>
                                                            <img src={variation?.images && variation?.images[0]} alt="" style={{ width: "60px", height: "60px" }} />
                                                         </td>
                                                         <td>{variation?._vId}</td>
                                                         <td>{variation?.sku}</td>
                                                         <td>



                                                            <Link className='bt9_edit' state={{ from: location }} replace
                                                               to={`/dashboard/manage-product?np=update-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}&vId=${variation?._vId}`}>
                                                               Update Variation
                                                            </Link>

                                                            <button className='bt9_delete m-1' title={`Delete ${mProduct?.title}`}
                                                               onClick={() => deleteProductVariationHandler(variation?._vId, mProduct?._id)}>
                                                               Delete this variation
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   )
                                                }) : <tr><td>No product in your drafts</td></tr>
                                             }
                                          </tbody>
                                       </table>
                                    </> :
                                    <>
                                       <div className="px-1">
                                          <Link className='bt9_create me-2' state={{ from: location }} replace
                                             to={`/dashboard/manage-product?np=add-new-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                                             Create Variation
                                          </Link>
                                       </div>

                                       <div className="d-flex align-items-center justify-content-between p-2">


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


                                          </div>
                                       </div>
                                    </>
                              }
                           </div>
                        )
                     }) : <p>Add Variation</p>
                  }

               </div>
            </div>
         }
      </>
   )
};

export default ManageProductHome;
import React, { useState, useEffect } from 'react';
import Spinner from '../../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../../Hooks/useFetch';
import { useMessage } from '../../../Hooks/useMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductDetailsModal from './Components/ProductDetailsModal';
import { useAuthContext } from '../../../lib/AuthProvider';
import { authLogout } from '../../../Shared/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { newCategory } from '../../../Assets/CustomData/categories';
import ManageProductHome from './ManageProductHome/ManageProductHome';
import ProductUpdate from './ProductUpdate/ProductUpdate';

const ManageProduct = () => {
   const { msg, setMessage } = useMessage();
   const { userInfo, role } = useAuthContext();
   const [items, setItems] = useState(1);
   const [url, setUrl] = useState("");

   let url2 = role === 'SELLER' ? `${process.env.REACT_APP_BASE_URL}api/product/product-count?seller=${userInfo?.seller?.storeInfos?.storeName}` :
      `${process.env.REACT_APP_BASE_URL}api/product/product-count`;

   // Fetching Data 
   const { data: counter, refetch: counterRefetch } = useFetch(url2);
   const { data: manageProducts, loading, refetch } = useFetch(url);

   // All States
   const [searchValue, setSearchValue] = useState("");
   const [filterCategory, setFilterCategory] = useState("all");
   const [productDetailsModal, setProductDetailsModal] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();

   // search query params
   const queryParams = new URLSearchParams(window.location.search).get("np");
   const querySeller = new URLSearchParams(window.location.search).get("s");
   const queryPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

   useEffect(() => {
      const setTimeUrl = setTimeout(() => {
         let url = `${process.env.REACT_APP_BASE_URL}api/product/manage-product?page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`

         setUrl(url);
      }, 200);
      return () => clearTimeout(setTimeUrl);
   }, [queryPage, searchValue, filterCategory]);

   useEffect(() => {
      if (searchValue.length > 0 || filterCategory !== "all") {
         setItems(1);
      } else {
         const pages = counter && Math.ceil(counter?.count / 8);
         setItems(pages);
      }
   }, [counter, searchValue, filterCategory]);

   let pageBtn = [];

   for (let i = 1; i <= items; i++) {
      pageBtn.push(i);
   }

   return (
      <div className='section_default'>
         <div className="container">
            {
               (queryParams === "edit_product" && querySeller === userInfo?.seller?.storeInfos?.storeName) ?
                  <>
                     <h6>Edit This Product</h6>
                     <button className='bt9_edit mb-4' onClick={() => navigate('/dashboard/manage-product')}>Cancel</button>

                     <ProductUpdate
                        userInfo={userInfo}
                        formTypes='update'
                        setMessage={setMessage}
                     />
                  </> : (queryParams === 'add-new-variation' && querySeller === userInfo?.seller?.storeInfos?.storeName) ?
                     <ProductUpdate
                        userInfo={userInfo}
                        formTypes='new-variation'
                        setMessage={setMessage}
                     />
                     : (queryParams === 'update-variation' && querySeller === userInfo?.seller?.storeInfos?.storeName) ?

                        <ProductUpdate
                           userInfo={userInfo}
                           formTypes='update-variation'
                           setMessage={setMessage}
                        />
                        :
                        <ManageProductHome
                           refetch={refetch}
                           setMessage={setMessage}
                           newCategory={newCategory}
                           role={role}
                           counter={counter}
                           loading={loading}
                           productDetailsModal={productDetailsModal}
                           manageProducts={manageProducts}
                           msg={msg}
                           setSearchValue={setSearchValue}
                           setFilterCategory={setFilterCategory}
                           setProductDetailsModal={setProductDetailsModal}
                           navigate={navigate}
                           authLogout={authLogout}
                           counterRefetch={counterRefetch}
                           queryPage={queryPage}
                           items={items}
                           pageBtn={pageBtn}
                           location={location}
                           faEye={faEye}
                           faPenToSquare={faPenToSquare}
                           faTrashAlt={faTrashAlt}
                           FontAwesomeIcon={FontAwesomeIcon}
                           Spinner={Spinner}
                           ProductDetailsModal={ProductDetailsModal}
                        />

            }
         </div>

      </div>
   );
};

export default ManageProduct;
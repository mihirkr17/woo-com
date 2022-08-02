import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import Breadcrumbs from '../../Shared/Breadcrumbs';
import Product from '../../Shared/Product';
import CategoryHeader from '../Home/Components/CategoryHeader';

const ProductSubCategory = () => {
   const BASE_URL = useBASE_URL();
   const { sub_category, category } = useParams();
   const [url, setUrl] = useState(category);
   const { data: productBySubCategory, loading } = useFetch(`${BASE_URL + url}`);
   const [filters, setFilters] = useState('best_match');
   const [brands, setBrands] = useState({ brand: [] });
   const [getBrand, setGetBrand] = useState(["all"]);
   const [products, setProducts] = useState([]);

   useEffect(() => {
      if (productBySubCategory) {
         let o = productBySubCategory.map(p => p?.brand).filter((p, i, fp) => {
            return p && fp.indexOf(p) === i;
         });
         setGetBrand(o);
      }
   }, [productBySubCategory]);

   useEffect(() => {
      let filterUrl;

      if (sub_category && filters) {
         filterUrl = `api/product-by-category?sub_category=${sub_category}&filters=${filters}`;
         setUrl(filterUrl);
      }
   }, [sub_category, filters]);

   useEffect(() => {
      let g;
      if (brands.brand.length > 0) {
         let bb = brands.brand.length > 0 && brands.brand.map(p => p);
         g = productBySubCategory && productBySubCategory.filter(p => bb.includes(p?.brand));
       
      } else {
         g = productBySubCategory;
      }
     
      return setProducts(g);
   }, [brands, productBySubCategory]);

   const handleChange = (e) => {
      const { value, checked } = e.target;
      const { brand } = brands;
      if (checked) {
         setBrands({
            brand: [...brand, value],
         });
      } else {
         setBrands({
            brand: brand.filter((e) => e !== value)
         });
      }
   }

   return (
      <div className="section_default">
         <CategoryHeader></CategoryHeader>
         <div className='container'>
            <Breadcrumbs></Breadcrumbs>
            <div className="p-2 border">
               <h5>{sub_category}</h5>
               <small className="badge bg-primary">{category}</small>
            </div>
            <div className="category_header py-4">
               <div className="sort_price">
                  <span>Sort By </span>
                  <select name="filter" id="" onChange={(e) => setFilters(e.target.value)}>
                     <option value="best_match">Best Match</option>
                     <option value="lowest">Lowest</option>
                     <option value="highest">Highest</option>
                  </select>
               </div>

               <div className='my-3'>
                  <small><strong>Choose By Brands</strong></small>
                  <div className="row">
                     {
                        getBrand && getBrand.map((b, i) => {
                           return (
                              <div className="col-12" key={i}>
                                 <label htmlFor={b} >
                                    <input type="checkbox" className='me-3' name={b} id={b} value={b} onChange={handleChange} />
                                    {b}
                                 </label>
                              </div>

                           )
                        })
                     }
                  </div>
               </div>
            </div>
            <div className="row">
               {
                  loading ? <Spinner/> : products && products.map(p => {
                     return (
                        <div key={p?._id} className="col-lg-3 mb-4">
                           <Product product={p}></Product>
                        </div>
                     )
                  })
               }
            </div>
         </div>
      </div>
   );
};

export default ProductSubCategory;
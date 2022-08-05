import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useCategories } from '../../Hooks/useCategories';
import { useFetch } from '../../Hooks/useFetch';

import Breadcrumbs from '../../Shared/Breadcrumbs';
import Product from '../../Shared/Product';
import CategoryHeader from '../Home/Components/CategoryHeader';
import "./ProductCategory.css";

const ProductCategory = () => {

   const { category } = useParams();
   const [url, setUrl] = useState("");
   const { data: productByCategory, loading } = useFetch(`${process.env.REACT_APP_BASE_URL + url}`);
   const [filters, setFilters] = useState('best_match');
   const [brands, setBrands] = useState({ brand: [] });
   const [getBrand, setGetBrand] = useState(["all"]);
   const [products, setProducts] = useState([]);
   const { subCategories } = useCategories(category);


   useEffect(() => {
      if (productByCategory) {
         let o = productByCategory.map(p => p?.brand).filter((p, i, fp) => {
            return p && fp.indexOf(p) === i;
         });
         setGetBrand(o);
      }
   }, [productByCategory]);

   // filter product by price
   useEffect(() => {
      let filterUrl;

      if (category && filters) {
         filterUrl = `api/product-by-category?category=${category}&filters=${filters}`;
         setUrl(filterUrl);
      }
   }, [category, filters]);

   useEffect(() => {
      let g;
      if (brands.brand.length > 0) {
         let bb = brands.brand.length > 0 && brands.brand.map(p => p);
         g = productByCategory && productByCategory.filter(p => bb.includes(p?.brand));

      } else {
         g = productByCategory;
      }

      return setProducts(g);
   }, [brands, productByCategory]);

   // if (loading) return <Spinner></Spinner>;

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

            <div className="category_head">
               <Breadcrumbs></Breadcrumbs>
               <div className="p-2 border-bottom">
                  <h5>{category}</h5>
                  <small className="badge bg-primary">{category}</small>
               </div>
            </div>

            <div className="row" style={{ position: "relative", height: "77vh" }}>
               <div className="category_left_side col-lg-2 border-end">
                  <div className="category_header py-4">
                     <div className="sort_price">
                        <span>Sort By </span>
                        <select name="filter" id="" onChange={(e) => setFilters(e.target.value)}>
                           <option value="best_match">Best Match</option>
                           <option value="lowest">Lowest</option>
                           <option value="highest">Highest</option>
                        </select>
                     </div>


                     <div className="py-3">
                        <ul>
                           {
                              subCategories && subCategories.map((c, i) => {
                                 return (
                                    <li key={i} className="mb-2">
                                       <Nav.Item as={Link} to={`/${category}/${c}`}>
                                          {c}
                                       </Nav.Item>
                                    </li>
                                 )
                              })
                           }
                        </ul>
                     </div>
                  </div>

               </div>
               <div className="category_right_side col-lg-10">
                  <div className="row">
                     {
                        loading ? <Spinner /> : products && products.map(p => {
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



         </div>
      </div>
   );
};

export default ProductCategory;
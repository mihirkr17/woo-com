import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { newCategory } from '../../Assets/CustomData/categories';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import Breadcrumbs from '../../Shared/Breadcrumbs';
import Product from '../../Shared/Product';

const ProductCategory = () => {
   const { category, sub_category, second_category } = useParams();
   const [url, setUrl] = useState("");
   const { data: productByCategory, loading } = useFetch(`${process.env.REACT_APP_BASE_URL + url}`);
   const [filters, setFilters] = useState('best_match');
   const [brands, setBrands] = useState({ brand: [] });
   const [getBrand, setGetBrand] = useState(["all"]);
   const [products, setProducts] = useState([]);

   const subCategory = newCategory && newCategory.find(e => e.category === category);
   const secondCategory = subCategory?.sub_category_items && subCategory?.sub_category_items.find(e => e.sub_category === sub_category);

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
      }

      if (category && sub_category) {
         filterUrl = `api/product-by-category?category=${category}&sb_category=${sub_category}&filters=${filters}`;
      }

      if (category && sub_category && second_category) {
         filterUrl = `api/product-by-category?category=${category}&sb_category=${sub_category}&sc_category=${second_category}&filters=${filters}`;
      }

      setUrl(filterUrl);
   }, [category, filters, sub_category, second_category]);

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
         <div className='container'>
            <div className="category_head">
               <Breadcrumbs path={[category, sub_category, (second_category || "")]}></Breadcrumbs>
               <div className="py-1 border-bottom">
                  <div className="sort_price">
                     <span>Sort By </span>
                     <select name="filter" id="" onChange={(e) => setFilters(e.target.value)}>
                        <option value="best_match">Best Match</option>
                        <option value="lowest">Lowest</option>
                        <option value="highest">Highest</option>
                     </select>
                  </div>
               </div>

            </div>

            <div className="row" style={{ position: "relative", height: "77vh" }}>
               <div className="category_left_side col-lg-2 col-md-3 border-end">
                  {
                     (category && !sub_category && !second_category) && <div className="py-1 ggt_ffo">
                        <small><strong>{category}</strong></small>
                        <ul>
                           {
                              subCategory?.sub_category_items && subCategory?.sub_category_items.map((c, i) => {
                                 return (
                                    <li key={i} className="my-1">
                                       <Nav.Item as={Link} to={`/${category}/${c?.sub_category}`}>
                                          {c?.sub_category}
                                       </Nav.Item>
                                    </li>
                                 )
                              })
                           }
                        </ul>
                     </div>
                  }
                  {
                     (sub_category && !second_category) && <div className="py-1 ggt_ffo">
                        <Link to={`/${category}`}><strong>{sub_category.replace(/[-]/g, " ")}</strong></Link>
                        <ul>
                           {
                              secondCategory?.second_category_items && secondCategory?.second_category_items.map((c, i) => {
                                 return (
                                    <li key={i} className="my-1">
                                       <Nav.Item as={Link} to={`/${category}/${sub_category}/${c}`}>
                                          {c.replace(/[-]/g, " ")}
                                       </Nav.Item>
                                    </li>
                                 )
                              })
                           }
                        </ul>
                     </div>
                  }


                  {
                     <div className='py-1 ggt_ffo'>
                        <small><strong>Brands</strong></small>
                        <div className="row">
                           {
                              getBrand && getBrand.map((b, i) => {
                                 return (
                                    <div className="col-12" key={i}>
                                       <label htmlFor={b} >
                                          <input type="checkbox" className='me-2' name={b} id={b} value={b} onChange={handleChange} />
                                          {b}
                                       </label>
                                    </div>

                                 )
                              })
                           }
                        </div>
                     </div>
                  }

               </div>
               <div className="category_right_side col-lg-10 col-md-9">
               {
                       products && products.length <= 0 && <p>No Result</p>
                     }
                  <div className="row py-3">
                     {
                        loading ? <Spinner /> : products && products.map(p => {
                           return (
                              <div key={p?._id} className="col-lg-3 col-md-6 mb-4">
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
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./CategoryHeader.css";
import fashion from "../../../Assets/Images/fashion.png";
import electronicsImage from "../../../Assets/Images/electronics.png";

const CategoryHeader = ({ thisFor }) => {
   const [sCategory, setSCategory] = useState("");
   const [category, setCategory] = useState([]);

   useEffect(() => {
      const fashionSubCategory = ["men's-clothing", "women's-clothing", "jewelry"];
      const electronicSubCategories = ["mobile-parts", "laptop-parts", "desktop-parts"];
      let pp = (sCategory === "electronics") ? electronicSubCategories : (sCategory === "fashion") ? fashionSubCategory : [];
      setCategory(pp);
   }, [sCategory]);

   const selectHandler = (params) => {
      if (params) {
         setSCategory(params);
      }
      else {
         setSCategory("");
      }
   }

   return (
      <>
         {
            thisFor === "home" && <div className="rounded mb-4 c_nav">
               <div className="d-flex align-items-center justify-content-center flex-wrap py-1 category_navbar shadow-bottom">
                  <div className="c_nav_btn" onMouseOver={() => selectHandler("fashion")}>
                     <Nav.Item className='text-dark a'>
                        <img src={fashion} alt="" />
                        <small>Fashion</small>
                     </Nav.Item>
                  </div>

                  <div className="c_nav_btn" onMouseOver={() => selectHandler("electronics")}>
                     <Nav.Item className='text-dark a'>
                        <img src={electronicsImage} alt="" />
                        <small>Electronics</small>
                     </Nav.Item>
                  </div>
               </div>

               <div className="p-2" onMouseLeave={() => selectHandler("")} style={sCategory ? { display: "block" } : { display: "none" }}>
                  <div className='card'>
                     <div className="card-body">
                        <ul>
                           {
                              category && category.map((c, i) => {
                                 return (
                                    <li key={i} className="mb-2">
                                       <Nav.Item as={Link} to={`/product/category/${sCategory}/${c}`}>
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
            </div>
         }
      </>
   );
};

export default CategoryHeader;
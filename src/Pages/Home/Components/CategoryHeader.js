import React, { useState } from 'react';
import { useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./CategoryHeader.css";
import fashion from "../../../Assets/Images/fashion.png";
import electronicsImage from "../../../Assets/Images/electronics.png";
import { useCategories } from '../../../Hooks/useCategories';

const CategoryHeader = ({ thisFor }) => {
   const [sCategory, setSCategory] = useState("");
   const { subCategories } = useCategories(sCategory);

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
                     <Nav.Item className='text-dark a' as={Link} to={`/fashion`}>
                        <img src={fashion} alt="" />
                        <small>Fashion</small>
                     </Nav.Item>
                  </div>

                  <div className="c_nav_btn" onMouseOver={() => selectHandler("electronics")}>
                     <Nav.Item className='text-dark a' as={Link} to={`/electronics`}>
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
                              subCategories && subCategories.map((c, i) => {
                                 return (
                                    <li key={i} className="mb-2">
                                       <Nav.Item as={Link} to={`/${sCategory}/${c}`}>
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
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { newCategory } from "../../../Assets/CustomData/categories";

const CategoryHeader = () => {
   const [active, setActive] = useState(false);
   const cateRef = useRef();
   const [ctg, setCtg] = useState({});

   useEffect(() => {
      function reportWindowSize() {
         const { offsetTop } = cateRef.current;

         if (window.scrollY >= offsetTop) {
            setActive(true);
         } else {
            setActive(false);
         }

      }
      // Trigger this function on resize
      window.addEventListener('scroll', reportWindowSize);
      //  Cleanup for componentWillUnmount
      return () => window.removeEventListener('scroll', reportWindowSize);
   }, []);

   const handleCategories = (name) => {
      setCtg(name);
   }

   console.log(ctg);
   return (
      <>

         <div className="rounded mb-4 c_nav" ref={cateRef}>
            <div className="d-flex align-items-center justify-content-center flex-wrap py-1 category_navbar shadow-bottom">

               {
                  newCategory && newCategory.map((c, i) => {
                     return (
                        <>
                           <div className="c_nav_btn" key={i} onMouseOver={() => handleCategories(c && c)}>
                              <Nav.Item className='a' as={Link} to={`/${c.category}`}>
                                 {
                                    active ? "" : <img src={c?.img} alt="" />
                                 }
                                 <small>{c.category}</small>
                              </Nav.Item>
                           </div>
                        </>
                     )
                  })
               }
            </div>

            <div className="cc_tty" style={ctg.category ? { display: "block" } : { display: "none" }} onMouseLeave={() => handleCategories({})} >
               <div className="c_sub_menu_wrapper">
                  <div className='row'>
                     {
                        ctg.sc && ctg.sc.map((subCtg, ind) => {
                           return (
                              <div className='col-lg-4 gg_tr' key={ind}>
                                 <p className="ai_tj">
                                    <Nav.Item as={Link} to={`/${ctg?.category}/${subCtg?.sub_category}`}>
                                       {subCtg?.sub_category}
                                    </Nav.Item>
                                 </p>

                                 <div className="ffg_th">
                                    {
                                       subCtg?.sc_item && subCtg?.sc_item.map((scCtg, ind) => {
                                          return (
                                             <p>
                                                <Nav.Item as={Link} key={ind} to={`/${ctg?.category}/${subCtg?.sub_category}/${scCtg}`}>
                                                   {scCtg.charAt(0).toUpperCase() + scCtg.slice(1).replace(/[-]/g, ' ')}
                                                </Nav.Item>
                                             </p>
                                          )
                                       })
                                    }
                                 </div>

                              </div>
                           )
                        })
                     }
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default CategoryHeader;
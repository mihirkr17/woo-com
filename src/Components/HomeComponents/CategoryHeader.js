import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CategoryHeader = ({ data }) => {
   let category;
   if (data) {
      let cate = [];
      for (let i = 0; i < data.length; i++) {
         cate.push(data[i].category);
      }
      category = cate && cate.filter((f, i, fArr) => {
         return fArr.indexOf(f) === i;
      })
   }
   return (
      <div className="bg-dark rounded my-4">
         <div className="d-flex align-items-center justify-content-around flex-wrap py-3">
            {
               category && category.map((c, i) => {
                  return (
   
                        <Nav.Item key={i} as={Link} to={`/product/category/${c}`} className='m-2 text-light'>
                           {c}
                        </Nav.Item>
              
                  )
               })
            }
         </div>
      </div>
   );
};

export default CategoryHeader;
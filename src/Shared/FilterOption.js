import React from 'react';

const FilterOption = ({ options, filterHandler }) => {
   return (
      <select name="filter_product" style={{ textTransform: "capitalize" }} className='form-select form-select-sm' onChange={e => filterHandler(e.target.value)}>
         {
            options && options.map((opt, index) => {
               return (
                  <option value={opt} key={index}>{opt}</option>
               )
            })
         }
      </select>
   );
};

export default FilterOption;
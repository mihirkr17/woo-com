import React from 'react';
import './Spinner.css';

const Spinner = () => {
   return (
      <div className="main_spinner">
         <div className="spinner">
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
         </div>
      </div>
   )
};

export default Spinner;


import React from 'react';

const ConfirmDialog = ({ payload }) => {
   return (
      <div className={`confirm_box ${payload?.openBox ? "active" : ""}`}>
         <span>Want to delete {payload?.reference?.title} ?</span>
         <div className="confirm_box_btn">
            <button className='btn btn-sm btn-secondary' onClick={() => payload?.setOpenBox(false)}>Cancel</button>
            <button className='btn btn-sm btn-danger' onClick={() => payload?.handler(payload?.reference)}>Delete</button>
         </div>
      </div>
   );
};

export default ConfirmDialog;
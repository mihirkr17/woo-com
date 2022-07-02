import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import UpdateProduct from '../Pages/Dashboard/ManageProduct/Components/UpdateProduct';

const CustomModal = ({ modalOpen, modalData, modalClose }) => {
   return (
      <Modal show={modalOpen}>
         <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <UpdateProduct></UpdateProduct>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={modalClose}>
               Close
            </Button>
         </Modal.Footer>
      </Modal>
   );
};

export default CustomModal;
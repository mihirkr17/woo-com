import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import "./UpdateProductModal.css"
import UpdateProduct from "./UpdateProduct";

const UpdateProductModal = ({ modalOpen, modalClose, refetch }) => {
   return (
      <Modal show={modalOpen}>
         <Modal.Header>
            <Button variant="danger" onClick={modalClose}>X</Button>
         </Modal.Header>
         <Modal.Body>
            <UpdateProduct data={modalOpen} refetch={refetch}></UpdateProduct>
         </Modal.Body>
      </Modal>
   );
};

export default UpdateProductModal;
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import "./ProductUpdateModal.css";
import ProductUpdate from './ProductUpdate';

const ProductUpdateModal = ({ modalOpen, modalClose, refetch, setMessage }) => {
   return (
      <Modal show={modalOpen}>
         <Modal.Header>
            <Button variant="danger" onClick={modalClose}>X</Button>
         </Modal.Header>
         <Modal.Body>
            <ProductUpdate data={modalOpen} modalClose={modalClose} setMessage={setMessage} refetch={refetch} />
         </Modal.Body>
      </Modal>
   );
};

export default ProductUpdateModal;
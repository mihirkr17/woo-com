import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import ProductModel from '../../../../Shared/ProductModel';

const ProductDetailsModal = ({ modalOpen: data, modalClose }) => {
   return (
      <Modal show={data} onHide={modalClose}>
         <Modal.Header>
            <Button variant="danger" onClick={modalClose}>X</Button>
         </Modal.Header>
         <Modal.Body>
            <ProductModel product={data}></ProductModel>
         </Modal.Body>
      </Modal>
   );
};

export default ProductDetailsModal;
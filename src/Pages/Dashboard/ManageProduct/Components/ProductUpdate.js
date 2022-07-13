import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { usePrice } from '../../../../Hooks/usePrice';
import { useBASE_URL } from '../../../../lib/BaseUrlProvider';

const ProductUpdate = ({ data, refetch, modalClose, setMessage }) => {
   const BASE_URL = useBASE_URL();
   const [desc, setDescription] = useState(data?.description || "CKEditor v5");
   const [inputValue, setInputValue] = useState({ price: data?.price, discount: data?.discount });
   const newDate = new Date();
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   const updateProductHandler = async (e) => {
      e.preventDefault();

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      let category = e.target.category.value;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let available = e.target.available.value;

      available = available === "" ? 0 : available;

      if (title === "" || image === "" || description === "" || category === "" || price === "" || discount === "") {
         window.alert("Required All Input Fields !");
         return;
      } else {
         const response = await fetch(`${BASE_URL}api/update-product/${data?._id}`, {
            method: "PUT",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({
               title, image, description,
               category, price: parseFloat(price),
               price_fixed,
               discount: parseFloat(discount),
               discount_amount_fixed,
               modifiedAt: newDate.toLocaleString(),
               available: parseInt(available)
            })
         });

         if (response.ok) {
            const resData = await response.json();
            resData && refetch();
            modalClose();
            setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
         }
      }
   }

   return (

      <div className='section_default'>
         <div className="container">
            <Form onSubmit={updateProductHandler}>
               <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridTitle">
                     <Form.Label>Product Title</Form.Label>
                     <Form.Control name="title" type="text" defaultValue={data?.title || ""} placeholder="Title" />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridImage">
                     <Form.Label>Product Image</Form.Label>
                     <Form.Control name="image" defaultValue={data?.image || ""} type="text" placeholder="Image Link" />
                  </Form.Group>
               </Row>


               <Form.Group>
                  <Form.Label>Product Description</Form.Label>
                  <CKEditor editor={ClassicEditor}
                     data={desc}
                     onChange={(event, editor) => {
                        const data = editor.getData();
                        return setDescription(data);
                     }}
                  />
               </Form.Group>

               <Row className="my-3">
                  <Form.Group controlId="formGridCategory">
                     <Form.Label>Product Category</Form.Label>
                     <Form.Select name='category'>
                        <option value={data?.category}>{data?.category}</option>
                        <option value="men's clothing">men's clothing</option>
                        <option value="women's clothing">women's clothing</option>
                        <option value="jewelry">jewelry</option>
                        <option value="electronics">electronics</option>
                     </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPrice">
                     <Form.Label>Price</Form.Label>
                     <Form.Control name='price' type='number' value={inputValue.price} onChange={handleInput} />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridDiscount">
                     <Form.Label>Discount</Form.Label>
                     <Form.Control name='discount' type='number' value={inputValue.discount} onChange={handleInput} />
                  </Form.Group>
               </Row>

               <Row className="my-3">
                  <Form.Group as={Col} controlId="formGridPrice">
                     <Form.Label>Price Fixed</Form.Label>
                     <Form.Control disabled defaultValue={price_fixed || inputValue?.price} key={price_fixed || inputValue?.price}></Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPrice">
                     <Form.Label>discount_amount_fixed</Form.Label>
                     <Form.Control disabled defaultValue={discount_amount_fixed || 0} key={discount_amount_fixed} />
                  </Form.Group>
               </Row>


               <Form.Group className="mb-3" id="formGridStock">
                  <Form.Label>Update Stock</Form.Label>
                  <Form.Control name='available' className='form-control-sm' defaultValue={data?.available || ""} type='number' />
                  <small className="p-1 text-muted">
                     Warning : If you set it to 0 then product will be stock out
                  </small>
               </Form.Group>

               <Button variant="primary" type="submit">
                  Update Product
               </Button>
            </Form>
         </div>
      </div>
   );
};

export default ProductUpdate;
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import "./AddProduct.css";
import { useMessage } from "../../../Hooks/useMessage";
import { useAuthUser } from "../../../lib/UserProvider";
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const AddProduct = () => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const [desc, setDescription] = useState("Hello CKEditor V5");
   const { msg, setMessage } = useMessage();
   const [inputValue, setInputValue] = useState({ price: "", discount: "" });
   const [discount_amount_fixed, setDiscount_amount_fixed] = useState(0);
   const [price_fixed, setPrice_fixed] = useState(0);
   const newDate = new Date();

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   useEffect(() => {
      let price = parseFloat(inputValue.price);
      let discount = parseFloat(inputValue.discount);

      let discount_amount_fixed = (price * discount) / 100;
      setDiscount_amount_fixed(discount_amount_fixed);
      let price_fixed = price - discount_amount_fixed;
      setPrice_fixed(price_fixed);
   }, [inputValue.price, inputValue.discount]);

   const addProductHandler = async (e) => {
      e.preventDefault();

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      let category = e.target.category.value;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let seller = user?.email;
      let rating = [];

      if (title === "" || image === "" || description === "" || category === "" || price === "" || discount === "") {
         setMessage(<p className='text-danger'><small><strong>Required All Input Fields !</strong></small></p>);
      } else {
         const response = await fetch(`${BASE_URL}add-product`, {
            method: "POST",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify({
               title, image, description,
               category, price: parseFloat(price),
               price_fixed,
               discount: parseFloat(discount),
               discount_amount_fixed,
               rating,
               seller,
               createAt: newDate.toLocaleString()
            })
         });

         if (response.ok) {
            await response.json();
            setMessage(<p className='text-success'><small><strong>Product Added Successfully</strong></small></p>);
            e.target.reset();
         }
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <h5 className='text-center pb-4'>Add Product</h5>

            <Form onSubmit={addProductHandler}>
               <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridTitle">
                     <Form.Label>Product Title</Form.Label>
                     <Form.Control name="title" type="text" placeholder="Title" />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridImage">
                     <Form.Label>Product Image</Form.Label>
                     <Form.Control name="image" type="text" placeholder="Image Link" />
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
                        <option>Choose...</option>
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

               <Row>

                  <Form.Group as={Col} controlId="formGridPrice">
                     <Form.Label>Price Fixed</Form.Label>
                     <Form.Control disabled defaultValue={price_fixed || inputValue?.price} key={price_fixed || inputValue?.price}></Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPrice">
                     <Form.Label>discount_amount_fixed</Form.Label>
                     <Form.Control disabled defaultValue={discount_amount_fixed || 0} key={discount_amount_fixed} />
                  </Form.Group>
               </Row>

               <Form.Group className="mb-3" id="formGridCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
               </Form.Group>
               {msg}
               <Button variant="primary" type="submit">
                  Add Product
               </Button>
            </Form>
         </div>
      </div>
   );
};

export default AddProduct;
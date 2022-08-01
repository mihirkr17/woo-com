import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import "./AddProduct.css";
import { useMessage } from "../../../Hooks/useMessage";
import { useBASE_URL } from '../../../lib/BaseUrlProvider';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { usePrice } from '../../../Hooks/usePrice';
import useAuth from '../../../Hooks/useAuth';


const AddProduct = () => {
   const BASE_URL = useBASE_URL();
   const { userInfo } = useAuth();
   const [desc, setDescription] = useState("Hello CKEditor V5");
   const { msg, setMessage } = useMessage();
   const [inputValue, setInputValue] = useState({ price: "", discount: "" });
   const newDate = new Date();
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);
   const [category, setCategory] = useState("");

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   const addProductHandler = async (e) => {
      e.preventDefault();

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      let sub_category = e.target.sub_category.value;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let seller = userInfo?.seller;
      let rating = [];
      let available = e.target.available.value;

      if (title === "" || image === "" || description === "" || category === "" || sub_category === "" || price === "" || discount === "") {
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
               sub_category,
               price_fixed,
               discount: parseFloat(discount),
               discount_amount_fixed,
               rating,
               seller,
               createAt: newDate.toLocaleString(),
               available: parseInt(available)
            })
         });

         if (response.ok) {
            await response.json();
            setMessage(<p className='text-success'><small><strong>Product Added Successfully</strong></small></p>);
            e.target.reset();
         }
      }
   }

   const categories = ["fashion", "electronics"];
   const fashionCategories = ["men's clothing", "women's clothing", "jewelry"];
   const electronicCategories = ["mobile parts", "laptop parts", "desktop parts"];
   const subCategories = category === "fashion" ? fashionCategories : category === "electronics" ? electronicCategories : []

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
                     <Form.Select name='category' onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Choose Category...</option>
                        {
                           categories && categories.map((items, index) => {
                              return (
                                 <option value={items} key={index}>{items.toUpperCase()}</option>
                              )
                           })
                        }
                     </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="formGridSubCategory">
                     <Form.Label>Product Sub Category</Form.Label>
                     <Form.Select name='sub_category'>
                        {
                           subCategories && subCategories.map((items, index) => {
                              return (
                                 <option value={items} key={index}>{items.toUpperCase()}</option>
                              )
                           })
                        }
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

               <Form.Group className="mb-3" id="formGridStock">
                  <Form.Label>Update Stock</Form.Label>
                  <Form.Control name='available' type='number' />
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
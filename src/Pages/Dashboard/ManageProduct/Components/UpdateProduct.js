import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useMessage } from '../../../../Hooks/useMessage';
import { useBASE_URL } from '../../../../lib/BaseUrlProvider';
import { useAuthUser } from '../../../../lib/UserProvider';

const UpdateProduct = ({ data, refetch }) => {
   const BASE_URL = useBASE_URL();
   const user = useAuthUser();
   const [desc, setDescription] = useState(data?.description || "CKEditor v5");
   const { msg, setMessage } = useMessage();
   const [inputValue, setInputValue] = useState({ price: data?.price, discount: data?.discount });
   const [discount_amount_fixed, setDiscount_amount_fixed] = useState(data?.discount_amount_fixed);
   const [price_fixed, setPrice_fixed] = useState(data?.price_fixed);
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
      let available = e.target.available.value;

      if (title === "" || image === "" || description === "" || category === "" || price === "" || discount === "") {
         setMessage(<p className='text-danger'><small><strong>Required All Input Fields !</strong></small></p>);
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
               rating,
               seller,
               modifiedAt: newDate.toLocaleString(),
               available: parseInt(available)
            })
         });

         if (response.ok) {
            await response.json();
            refetch();
            setMessage(<p className='text-success'><small><strong>Product Upa Successfully</strong></small></p>);
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
                  <Form.Control name='available' defaultValue={data?.available || ""} type='number' />
               </Form.Group>

               <Button variant="primary" type="submit">
                  Update Product
               </Button>
            </Form>
            {msg}
         </div>
      </div>
   );
};

export default UpdateProduct;
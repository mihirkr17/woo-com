import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { usePrice } from '../../../../Hooks/usePrice';
import { useBASE_URL } from '../../../../lib/BaseUrlProvider';

const ProductUpdate = ({ data, refetch, modalClose, setMessage }) => {
   const BASE_URL = useBASE_URL();
   const [desc, setDescription] = useState(data?.description || "CKEditor v5");
   const [inputValue, setInputValue] = useState({ price: data?.price, discount: data?.discount });
   const newDate = new Date();
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);
   const [category, setCategory] = useState(data?.category);
   const [categories, setCategories] = useState([]);
   const [subCategories, setSubCategories] = useState([]);

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   const slugMaker = (string) => {
      return string.toLowerCase()
         .replace(/ /g, '-')
         .replace(/[^\w-]+/g, '');
   }


   const updateProductHandler = async (e) => {
      e.preventDefault();

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      let sub_category = e.target.sub_category.value;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let available = e.target.available.value;
      let slug = slugMaker(title);
      let brand = e.target.brand.value;

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
               title, slug, brand, image, description,
               category, sub_category, price: parseFloat(price),
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

   useEffect(() => {
      const categories = ["fashion", "electronics"];
      const fashionCategories = ["men's-clothing", "women's-clothing", "jewelry"];
      const electronicCategories = ["mobile-parts", "laptop-parts", "desktop-parts"];
      const subCategories = category && data?.category === "fashion" ? fashionCategories : category && data?.category === "electronics" ? electronicCategories : []
      setCategories(categories);
      setSubCategories(subCategories);
   }, [category, data?.category]);



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
                  <Form.Group as={Col} controlId="formGridBrand">
                     <Form.Label>Product Brand</Form.Label>
                     <Form.Control name="brand" type="text" defaultValue={data?.brand && data?.brand} placeholder="Brand Name..." key={data?.brand && data?.brand} />
                  </Form.Group>
               </Row>

               <Row className="my-3">

                  <Form.Group as={Col} controlId="formGridCategory">
                     <Form.Label>Product Category</Form.Label>
                     <Form.Select name='category' onChange={(e) => setCategory(e.target.value)}>
                        <option value={data?.category && data?.category}>{data?.category && data?.category.toUpperCase()}</option>
                        {
                           categories && categories.map((items, index) => {
                              return (
                                 <option value={items} key={index}>{items.toUpperCase()}</option>
                              )
                           })
                        }
                     </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridSubCategory">
                     <Form.Label>Product Sub Category</Form.Label>
                     <Form.Select name='sub_category'>
                        {data?.sub_category && <option value={data?.sub_category}>{data?.sub_category.toUpperCase()}</option>}
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
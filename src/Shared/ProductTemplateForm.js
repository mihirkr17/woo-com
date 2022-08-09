import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useCategories } from '../Hooks/useCategories';
import { usePrice } from '../Hooks/usePrice';
import { useMessage } from '../Hooks/useMessage';
import { loggedOut, slugMaker } from './common';
import BtnSpinner from '../Components/Shared/BtnSpinner/BtnSpinner';
import { useNavigate } from 'react-router-dom';

const ProductTemplateForm = ({ userInfo, formTypes, data, modalClose, refetch }) => {
   const navigate = useNavigate();
   const [desc, setDescription] = useState((data?.description && data?.description) || "CKEditor v5");
   const [inputValue, setInputValue] = useState({ price: (data?.price && data?.price) || "", discount: (data?.discount && data?.discount) || "" });
   const { price_fixed, discount_amount_fixed } = usePrice(inputValue.price, inputValue.discount);
   const { msg, setMessage } = useMessage();
   const newDate = new Date();
   const [actionLoading, setActionLoading] = useState(false);
   const [ctg, setCtg] = useState({ category: "", sub_category: "", second_category: "" });
   const { Categories, subCategories, secondCategories } = useCategories(ctg);

   const handleCtgValues = (e) => {
      let values = e.target.value;
      setCtg({ ...ctg, [e.target.name]: values })
   }

   const handleInput = (e) => {
      const values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values });
   }

   const productHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      let title = e.target.title.value;
      let image = e.target.image.value;
      let description = desc;
      // let sub_category = e.target.sub_category.value;
      let price = inputValue.price;
      let discount = inputValue.discount;
      let rating = [
         { weight: 5, count: 0 },
         { weight: 4, count: 0 },
         { weight: 3, count: 0 },
         { weight: 2, count: 0 },
         { weight: 1, count: 0 },
      ];
      let available = e.target.available.value;
      let brand = e.target.brand.value;

      let slug = slugMaker(title);

      const genre = {
         category: ctg?.category, // category
         sub_category: ctg?.sub_category, // sub category
         second_category: ctg?.second_category // third category
      }

      let product = {
         title,
         slug,
         brand,
         image,
         description,
         genre,
         price: parseFloat(price),
         price_fixed,
         discount: parseFloat(discount),
         discount_amount_fixed,
         available: parseInt(available)
      }

      if (formTypes === "update") {
         product["modifiedAt"] = newDate.toLocaleString();
      } else {
         product["seller"] = userInfo?.seller;
         product["rating"] = rating;
         product["rating_average"] = 0;
         product["createAt"] = newDate.toLocaleString();
      }

      const requestType = {
         url: formTypes === "update" ? `${process.env.REACT_APP_BASE_URL}api/update-product/${data?._id && data?._id}` : `${process.env.REACT_APP_BASE_URL}api/add-product`,
         method: formTypes === "update" ? "PUT" : "POST"
      }

      if (
         title === "" || image === "" ||
         description === "" || ctg.category === "" ||
         ctg.sub_category === "" || price === "" ||
         discount === "" || brand === "" || ctg.second_category === ""
      ) {
         setMessage(<p className='text-danger'><small><strong>Required All Input Fields !</strong></small></p>);
         setActionLoading(false);
         return;
      } else {
         const response = await fetch(requestType?.url, {
            method: requestType?.method,
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
         });

         const resData = await response.json();

         if (response.ok) {
            setActionLoading(false);

            if (formTypes === "create") {
               setMessage(<p className='text-success'><small><strong>Product Added Successfully</strong></small></p>);
               e.target.reset();
            } else {
               resData && refetch();
               modalClose();
               setMessage(<p className='text-success'><small><strong>{resData?.message}</strong></small></p>);
            }
         } else {
            setActionLoading(false);
            await loggedOut();
            navigate("/login?q=unauthorized");
         }
      }
   }

   const selectOption = (arr, values) => {
      return (
         <select name={values} id={values} onChange={handleCtgValues}>
            <option value="">Choose {values}</option>
            {
               arr && arr.map((c, i) => {
                  return (
                     <option value={c} key={i}>{c}</option>
                  )
               })
            }
         </select>
      )
   }


   return (
      <Form onSubmit={productHandler}>
         <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridTitle">
               <Form.Label>Product Title</Form.Label>
               <Form.Control name="title" type="text" defaultValue={(data?.title && data?.title) || ""} placeholder="Title" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridImage">
               <Form.Label>Product Image</Form.Label>
               <Form.Control name="image" type="text" defaultValue={(data?.image && data?.image) || ""} placeholder="Image Link" />
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
               <Form.Control name="brand" type="text" defaultValue={(data?.brand && data?.brand) || ""} placeholder="Brand Name..." />
            </Form.Group>
         </Row>

         <div className="row my-3">
            <Form.Group as={Col} controlId="formGridCategory">
               <Form.Label>Product Category</Form.Label> <br />
               {
                  selectOption(Categories, "category")
               }
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCategory">
               <Form.Label>Product Sub Category</Form.Label> <br />
               {
                  selectOption(subCategories, "sub_category")
               }
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCategory">
               <Form.Label>Product Second Category</Form.Label> <br />
               {
                  selectOption(secondCategories, "second_category")
               }
            </Form.Group>
         </div>

         <Row className="my-3">
            {/* <Form.Group as={Col} controlId="formGridCategory">
               <Form.Label>Product Category</Form.Label>
               <Form.Select name='category' onChange={(e) => setCategory(e.target.value)}>
                  {
                     data && data?.category ? <option value={data?.category}>{data?.category.toUpperCase()}</option>
                        : <option value="">Choose Category...</option>
                  }
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
               <Form.Label>Product Sub Category <br />
                  <small className='text-muted'>{data && data?.sub_category && data && data?.sub_category}</small>
               </Form.Label>

               <Form.Select name='sub_category'>
                  {
                     subCategories && subCategories.map((items, index) => {
                        return (
                           <option value={items} key={index}>{items.toUpperCase()}</option>
                        )
                     })
                  }
               </Form.Select>
            </Form.Group> */}

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
            <Form.Control name='available' type='number' defaultValue={(data?.available && data?.available) || ""} />
            <small className="p-1 text-muted">
               Warning : If you set it to 0 then product will be stock out
            </small>
         </Form.Group>
         {msg}
         <Button variant="primary" type="submit">
            {
               actionLoading ? <BtnSpinner text={formTypes === "create" ? "Adding..." : "Updating..."} /> :
                  formTypes === "create" ? "Add Product" : "Update Product"
            }
         </Button>
      </Form>
   );
};

export default ProductTemplateForm;
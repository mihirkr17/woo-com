import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { auth } from '../../firebase.init';
import { useFetch } from '../../Hooks/useFetch';

const Purchase = () => {
   const { productId } = useParams();
   const [user] = useAuthState(auth);

   const { data, loading, refetch } = useFetch(`http://localhost:5000/order-address/${user?.email}`);
   const { data: product, loading: productLoading, refetch: refetchh } = useFetch(`http://localhost:5000/single-cart-product/${productId}`);
   const [add, setAdd] = useState(false);
   const [step, setStep] = useState(false);
   const [msg, setMsg] = useState("");
   const navigate = useNavigate();

   if (loading || productLoading) {
      return <Spinner></Spinner>;
   }

   console.log(product);

   const addAddressHandler = async (e) => {
      e.preventDefault();
      let name = e.target.name.value;
      let address = e.target.address.value;
      let city = e.target.city.value;
      let phone = e.target.phone.value;
      let zip = e.target.zip.value;

      let final = { name, address, city, phone, zip };


      const response = await fetch(`http://localhost:5000/order-address/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(final)
      });

      if (response.ok) {
         const resData = await response.json();

         if (resData) {
            console.log(resData);
            refetch();
         }
      }
   }

   const quantityHandler = async (product, params) => {

      let quantity;

      if (params === "dec") {
         quantity = product?.quantity - 1;
      } else if (params === "inc") {
         quantity = product?.quantity + 1;
      }

      let price = parseInt(product?.price) * parseInt(quantity);

      product['quantity'] = quantity;
      product['total_price'] = price;

      const response = await fetch(`http://localhost:5000/single-cart-product/${product?._id}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(product)
      })

      const resData = await response.json();

      if (resData) {
         refetchh();
      }
   }

   const removeFromCartHandler = async (product) => {
      const { _id, title } = product;
      let confirmMsg = window.confirm("Want to remove this item from your cart ?");
      if (confirmMsg) {
         const response = await fetch(`http://localhost:5000/delete-cart-item/${_id}`, {
            method: "DELETE"
         });

         if (response.ok) {
            const resData = await response.json();
            if (resData) {
               setMsg(`Successfully remove ${title} from your cart`);
               navigate('/');

            }
         }
      }
   }

   if (data.length > 0 || user || product) {
      return (
         <div className='section_default'>
            {msg}
            <div className="container">
               <div className="row">
                  <div className="col-12">
                     <div className="card_default">
                        <div className="card_description">
                           <div className="row">
                              <div className="col-lg-1"><span>1</span></div>
                              <div className="col-lg-8">
                                 <div className="badge bg-success">Login</div>
                                 <p>{user?.email + user?.displayName}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-12 mt-3">
                     <div className="card_default">
                        <div className="card_description">
                           <div className="row">
                              <div className="col-lg-1"><span>2</span></div>
                              <div className="col-lg-8">
                                 <div className="badge bg-success">Delivery Address</div>

                                 <div className="py-2">
                                    <address>
                                       <p>{data?.name}</p>
                                       <p>{data?.address + data?.city + data?.phone}</p>
                                       <div className="d-flex align-items-center justify-content-end">
                                          <button className='btn btn-warning' style={add === false ? { display: "block" } : { display: "none" }}>Deliver Here</button>
                                          <button className='btn btn-primary ms-2' style={add === false ? { display: "block" } : { display: "none" }} onClick={() => setAdd(true)}>Edit Address</button>
                                       </div>
                                    </address>
                                 </div>

                                 <div style={add === true ? { display: "block" } : { display: "none" }} className="address_edit_form">
                                    <form onSubmit={addAddressHandler}>
                                       <div className="form-group my-3">
                                          <label htmlFor="name">Name</label>
                                          <input type="text" defaultValue={data?.name} className='form-control' name='name' />
                                       </div>
                                       <div className="form-group my-3">
                                          <label htmlFor="address">Address</label>
                                          <input type="text" defaultValue={data?.address} className='form-control' name='address' />
                                       </div>
                                       <div className="form-group my-3">
                                          <label htmlFor="city">City</label>
                                          <input type="text" defaultValue={data?.city} className='form-control' name='city' />
                                       </div>
                                       <div className="form-group my-3">
                                          <label htmlFor="zip">Zip</label>
                                          <input type="text" defaultValue={data?.zip} className='form-control' name='zip' />
                                       </div>
                                       <div className="form-group my-3">
                                          <label htmlFor="phone">Phone</label>
                                          <input type="number" defaultValue={data?.phone} className='form-control' name='phone' />
                                       </div>
                                       <div className="form-group my-3">
                                          <button className='btn btn-primary' type='submit'>Save And Deliver Here</button>
                                       </div>
                                    </form>
                                    <button className='btn btn-primary' onClick={() => setAdd(false)}>Cancel</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="col-12 my-3">
                     <div className="card_default">
                        <div className="card_description">
                           <div className="row">
                              <div className="col-lg-1"><span>1</span></div>
                              <div className="col-lg-8">
                                 <div className="col-12 my-3" key={product._id}>
                                    <div className="card_default cart">
                                       <div className="cart_img">
                                          <img src={product.image} alt="" />
                                          <div className="cart_btn">
                                             <button className='btn btn-sm btn-primary' disabled={product?.quantity <= 1 ? true : false} onClick={(e) => quantityHandler(product, "dec")}>-</button>
                                             <input type="text" className='form-control' key={product?.quantity} defaultValue={product?.quantity} name="counter" id="counter" />
                                             <button className='btn btn-sm btn-primary' onClick={(e) => quantityHandler(product, "inc")}>+</button>
                                          </div>
                                       </div>
                                       <div className="card_description">
                                          <div className="card_title">{product.title}</div>
                                          <div className="remove_btn">
                                             <button className='btn btn-sm btn-danger' onClick={() => removeFromCartHandler(product)}>Remove</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      );
   }
};

export default Purchase;
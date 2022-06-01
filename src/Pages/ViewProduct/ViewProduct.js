import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import { useFetch } from '../../Hooks/useFetch';
import "./ViewProduct.css";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase.init';
import { useMessage } from '../../Hooks/useMessage';

const ViewProduct = () => {
   const { productId } = useParams();
   const [user] = useAuthState(auth);
   const { data: product, loading, refetch } = useFetch(`http://localhost:5000/view-product/${productId}`);
   const navigate = useNavigate();
   const { msg, setMessage } = useMessage();

   if (loading) {
      return <Spinner></Spinner>;
   }

   const addToCartHandler = async (product, params) => {

      let productPrice = parseInt(product?.price);
      let productDiscount = parseInt(product?.discount) || 0;
      let discount = (productDiscount / 100) * productPrice;
      let total_price = productPrice - discount;

      product['quantity'] = parseInt(product?.quantity) || 1;
      product['total_price'] = productPrice
      product['user_email'] = user?.email;
      product['discount'] = parseInt(product?.discount) || 0;
      product['total_discount'] = discount;
      product['final_price'] = total_price;
      product['final_discount'] = discount;

      const response = await fetch(`http://localhost:5000/my-cart/${user?.email}`, {
         method: "PUT",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(product)
      });

      const resData = await response.json();

      if (resData) {
         setMessage(resData?.message);
         if (params === "buy") {
            navigate(`/product/purchase/${product?._id}`);
         } else {
            navigate('/my-cart');
         }
      }
   }



   return (
      <div className='view_product section_default'>
         <div className="container">
            {msg}
            <div className="row">
               <div className="col-lg-6 view_product_sidebar">
                  <div className="product_image">
                     <img src={product.image} alt="" />
                  </div>
                  <div className="d-flex align-items-center justify-content-evenly py-3 mt-4">
                     {
                        product?.cardHandler === false ?
                           <button className='btn btn-primary' onClick={() => addToCartHandler(product)}>Add To Cart</button> :
                           <button className='btn btn-primary' onClick={() => navigate('/my-cart')}>Go To Cart</button>
                     }

                     <button className='btn btn-warning' onClick={() => addToCartHandler(product, "buy")}>Buy Now</button>
                  </div>
               </div>
               <div className="col-lg-6">
                  <article className="product_description">
                     <strong className="badge bg-primary">
                        {product.category}
                     </strong>
                     <h5 className="product_title py-3">{product.title}</h5>
                     <h3>{product.price}</h3>
                     <small>{product?.rating?.rate}</small>
                     <p>
                        {product.description}
                     </p>
                  </article>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ViewProduct;
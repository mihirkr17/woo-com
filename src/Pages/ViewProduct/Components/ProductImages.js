import React, { useEffect, useState } from 'react';
import { faCartShopping, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProductImages = ({ product, userInfo, authRefetch, setMessage, productRefetch }) => {
   const [tabImg, setTabImg] = useState("");
   const [zoom, setZoom] = useState({ transform: "translate3d('0px, 0px, 0px')" });
   useEffect(() => setTabImg(product?.variations?.images && product?.variations?.images[0]), [product?.variations?.images]);


   const handleImgTab = (params) => {
      setTabImg(params);
   }

   function handleImageZoom(e) {

      const { left, top, width, height } = e.target.getBoundingClientRect()
      const x = (e.pageX - left) / width * 100
      const y = (e.pageY - top) / height * 100
      setZoom({ transform: `translate3d(${x}px, ${y}px, 0px)` })
   }

   const addToWishlist = async (product) => {

      let wishlistProduct = {
         _id: product._id,
         title: product.title,
         slug: product.slug,
         brand: product.brand,
         image: product.images[0],
         pricing: product?.pricing?.sellingPrice,
         stock: product?.stockInfo?.stock,
         user_email: userInfo?.email,
         seller: product?.seller?.name
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/wishlist/add-to-wishlist/${userInfo?.email}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(wishlistProduct)
      })

      const resData = await response.json();

      if (response.ok) {
         productRefetch();
         authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{resData?.message}</strong></small></p>);
      }
   }

   const removeToWishlist = async (productId) => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/wishlist/remove-from-wishlist/${productId}`, {
         method: "DELETE",
         withCredentials: true,
         credentials: "include"
      })

      const resData = await response.json();

      if (response.ok) {
         productRefetch();
         authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{resData?.message}</strong></small></p>);
      }
   }

   return (
      <div className="view_product_sidebar">
         {
            product?.inWishlist ? <button title='Remove from wishlist' className='wishlistBtn active' onClick={() => removeToWishlist(product?._id)}>
               <FontAwesomeIcon icon={faHeart} />
            </button>
               : <button className='wishlistBtn' title='Add to wishlist' onClick={() => addToWishlist(product)}>
                  <FontAwesomeIcon icon={faHeart} />
               </button>
         }
         <div className="product_image" onMouseOver={handleImageZoom}>
            <img src={tabImg && tabImg} alt="" />
         </div>
         <div className="product_image_tab">
            {
               product?.variations?.images && product?.variations?.images.map((img, index) => {
                  return (
                     <div key={index} className="image_btn" onMouseOver={() => handleImgTab(img)}>
                        <img src={img} alt="" />
                     </div>
                  )
               })
            }
         </div>
      </div>
   );
};

export default ProductImages;
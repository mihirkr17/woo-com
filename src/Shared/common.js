import { signOut } from 'firebase/auth';
import { auth } from '../firebase.init';

export const slugMaker = (string) => {
   return string.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '').trim();
}

export const averageRating = (rating) => {
   let weightVal = 0;
   let countValue = 0;
   rating && rating.length > 0 && rating.forEach(rat => {
      const multiWeight = parseInt(rat?.weight) * parseInt(rat?.count);
      weightVal += multiWeight;
      countValue += rat?.count;
   });
   const ava = weightVal / countValue;
   const average = parseFloat(ava.toFixed(1));
   return average;
}
// ${process.env.REACT_APP_BASE_URL}
export const loggedOut = async () => {
   signOut(auth);
   const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/sign-out`, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
   });
   const resData = await response.json();
   if (response.ok) {
      console.log(resData?.message);
   }
};

// for cart calculation
export const cartCalculate = (product) => {
   let p;
   if (product) {
      p = {
         totalPrice: (product.map(p => (parseFloat(p?.price)) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0).toFixed(2)),
         totalQuantity: product.map(p => parseInt(p?.quantity)).reduce((p, c) => p + c, 0),
         totalDiscount: (product.map(p => (parseFloat(p?.discount_amount_fixed)) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0).toFixed(2)),
         totalAmount: function () {
            return (this.totalPrice - this.totalDiscount).toFixed(2)
         }
      }
   } else {
      p = {
         totalPrice: 0,
         totalQuantity: 0,
         totalDiscount: 0,
         totalAmount: function () {
            return 0;
         }
      }
   }

   return p;
}
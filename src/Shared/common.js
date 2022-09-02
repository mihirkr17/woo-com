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
   const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/user/sign-out`, {
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
         shippingFee: product.map(p => parseFloat(p?.shipping_fee)).reduce((p, c) => p + c, 0) || 0,
         totalAmount: (product.map(p => (parseFloat(p?.totalAmount) + parseFloat(p?.shipping_fee || 0))).reduce((p, c) => p + c, 0).toFixed(2))
      }
   } else {
      p = {
         totalPrice: 0,
         totalQuantity: 0,
         shippingFee: 0,
         totalAmount: 0
      }
   }

   return p;
}

export const apiHandler = async (url, method = "GET", authorization, body = {}) => {
   const response = await fetch(url, {
      method,
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         authorization: authorization || ""
      },
      body: JSON.stringify(body)
   });

   const resData = await response.json();

   if (response.status === 400) {
      console.log(resData?.message);
   }

   if (response.ok) {
      return resData;
   }
}

export const commissionRate = (prices = 0, quantity = 0) => {
   const price = parseFloat(prices);
   const productQuantity = parseInt(quantity);
   let ownerProfit = 0;
   ownerProfit = (price * 5) / 100;
   ownerProfit = (ownerProfit * productQuantity);
   ownerProfit = parseFloat(ownerProfit.toFixed(2));
   return { ownerProfit }
}
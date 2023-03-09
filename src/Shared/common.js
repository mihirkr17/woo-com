
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
export const authLogout = async () => {
   const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/v1/auth/sign-out`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
   });
   if (response.ok) {
      window.location.reload();
   }
};

// for cart calculation
export function cartCalculate(product) {
   let p;
   if (product) {
      p = {
         totalPrice: (product.map(p => (parseFloat(p?.price)) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0).toFixed(2)),
         totalQuantity: product.map(p => parseInt(p?.quantity)).reduce((p, c) => p + c, 0),
         shippingFee: product.map(p => parseFloat(p?.shippingCharge)).reduce((p, c) => p + c, 0) || 0,
         totalAmount: (product.map(p => (parseFloat(p?.totalAmount))).reduce((p, c) => p + c, 0).toFixed(2)),
         finalAmount: (product.map(p => (parseFloat(p?.totalAmount) + p?.shippingCharge || 0)).reduce((p, c) => p + c, 0).toFixed(2)),
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

export const apiHandler = async (url, method = "GET", authorization = null, body = {}) => {
   const response = await fetch(url, {
      method,
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         authorization: authorization
      },
      body: JSON.stringify(body)
   });

   const resData = await response.json();

   return {
      success: resData?.success,
      status: response.status,
      error: resData?.error,
      message: resData?.message
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

export const emailValidator = (email) => {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}

export const camelToTitleCase = (str) => {
   if (!str) {
      return false;
   }

   let newStr = str.replace(/([A-Z])/g, " $1");

   return newStr.charAt(0).toUpperCase() + newStr.slice(1);
}


export const textToTitleCase = (str) => {

   if (!str) {
      return false;
   }

   let newStr = str.split(/[-]|[_]|[A-Z]/g);

   let finalStr = "";

   for (let i = 0; i < newStr.length; i++) {
      finalStr += newStr[i].charAt(0).toUpperCase() + newStr[i].slice(1) + " ";
   }

   return finalStr.trim();
}


export const callApi = async (url, method, body) => {
   return await fetch(url, {
      method,
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
   })
}

export const calcTime = (iso, offset) => {

   let date = new Date(iso);

   let utc = date.getTime() + (date.getTimezoneOffset() * 60000);

   let nd = new Date(utc + (3600000 * offset));

   return nd?.toLocaleTimeString();
}
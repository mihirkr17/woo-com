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
   const average = parseFloat(ava.toFixed(2));
   return average;
}

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
      
   }
};
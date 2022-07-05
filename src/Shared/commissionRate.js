export const commissionRate = (pf, pq) => {
   const priceFixed = parseFloat(pf);
   const productQuantity = parseInt(pq);
   let commission = 0;
   let commission_rate = 0;

   if (priceFixed > 50) {
      commission = (priceFixed * 3) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else if (priceFixed > 100) {
      commission = (priceFixed * 6) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else if (priceFixed > 150) {
      commission = (priceFixed * 9) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else if (priceFixed > 200) {
      commission = (priceFixed * 12) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else if (priceFixed > 250) {
      commission = (priceFixed * 15) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else if (priceFixed > 300) {
      commission = (priceFixed * 18) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   } else {
      commission = (priceFixed * 1.5) / 100;
      commission_rate = commission;
      commission = commission * productQuantity;
   }

   return { commission, commission_rate }
}
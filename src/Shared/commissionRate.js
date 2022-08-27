export const commissionRate = (prices = 0, quantity = 0) => {
   const price = parseFloat(prices);
   const productQuantity = parseInt(quantity);
   let ownerProfit = 0;

   ownerProfit = (price * 5) / 100;
   ownerProfit = (ownerProfit * productQuantity);
   ownerProfit = parseFloat(ownerProfit.toFixed(2));
   // commission_rate = commission;
   // commission = commission * productQuantity;


   // if (price <= 300) {
   //    commission = (price * 3) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else if (price > 100) {
   //    commission = (price * 6) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else if (price > 150) {
   //    commission = (price * 9) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else if (price > 200) {
   //    commission = (price * 12) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else if (price > 250) {
   //    commission = (price * 15) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else if (price > 300) {
   //    commission = (price * 18) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // } else {
   //    commission = (price * 1.5) / 100;
   //    commission_rate = commission;
   //    commission = commission * productQuantity;
   // }

   return { ownerProfit }
}
import { useState, useEffect } from "react";

export const usePrice = (productPrice, productDiscount) => {
   const [discount_amount_fixed, setDiscount_amount_fixed] = useState(productDiscount || 0);
   const [price_fixed, setPrice_fixed] = useState(productPrice || 0);

   useEffect(() => {
      let price = parseFloat(productPrice);
      let discount = parseFloat(productDiscount);
      let discountAmountFixed = (price * discount) / 100;
      discountAmountFixed = parseFloat(discountAmountFixed.toFixed(2));
      setDiscount_amount_fixed(discountAmountFixed);
      setPrice_fixed(parseFloat((price - discountAmountFixed).toFixed(2)));
   }, [productPrice, productDiscount])

   return { price_fixed, discount_amount_fixed };
}
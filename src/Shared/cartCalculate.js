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
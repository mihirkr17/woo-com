export const cartCalculate = (product) => {
   let p;
   if (product) {
      p = {
         totalPrice: product.map(p => Math.round(parseFloat(p?.price)) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0),
         totalQuantity: product.map(p => parseInt(p?.quantity)).reduce((p, c) => p + c, 0),
         totalDiscount: product.map(p => (parseFloat(p?.discount_amount_fixed)) * parseInt(p?.quantity)).reduce((p, c) => p + c, 0),
         totalAmount: function () {
            return Math.round(this.totalPrice - this.totalDiscount)
         }
      }
   }

   return p;
}
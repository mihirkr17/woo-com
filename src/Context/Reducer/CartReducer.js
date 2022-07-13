export const cartReducer = (state, action) => {
   switch (action.type) {

      case 'INITIALIZE_CART':
         return {
            ...action.payload
         };
      case 'REMOVE_CART':
         return {...action.payload}
      default:
         return state;
   }
}
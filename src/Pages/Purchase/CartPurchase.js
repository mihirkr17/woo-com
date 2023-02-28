import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartCheckOut from '../CheckOut/CartCheckOut';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const CartPurchase = () => {
   return (
      <div>
         <Elements stripe={stripePromise}>
            <CartCheckOut></CartCheckOut>
         </Elements>
      </div>
   );
};

export default CartPurchase;
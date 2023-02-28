import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SingleCheckOut from '../CheckOut/SingleCheckOut';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK_KEY);

const SinglePurchase = () => {
   return (
      <div>
         <Elements stripe={stripePromise}>
            <SingleCheckOut></SingleCheckOut>
         </Elements>
      </div>
   );
};

export default SinglePurchase;
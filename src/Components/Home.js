import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
   return (
      <div>
         This is home page

         <Link to={'/login'} >Login</Link>
      </div>
   );
};

export default Home;
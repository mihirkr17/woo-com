import React from 'react';
import FlashSale from './Components/FlashSale';
// import Banner from './Components/Banner';
import HomeStore from './Components/HomeStore';


const Home = () => {
   return (
      <section className='home__section'>
         <FlashSale></FlashSale>
         <HomeStore></HomeStore>
      </section >
   );
};

export default Home;
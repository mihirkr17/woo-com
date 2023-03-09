import React from 'react';
import FlashSale from './Components/FlashSale';
// import Banner from './Components/Banner';
import HomeStore from './Components/HomeStore';


const Home = () => {


   // function calcTime (zone, offset) {
   //    let date = new Date();

   //    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);

   //    let nd = new Date(utc + (3600000 * offset));

   //    return nd?.toLocaleTimeString();
   // }

   // let d = calcTime("Dhaka", "+6");

   // console.log(d);
   return (
      <section className='home__section'>
         <FlashSale></FlashSale>
         <HomeStore></HomeStore>
      </section >
   );
};

export default Home;
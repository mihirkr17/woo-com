import React from 'react';
// import Banner from './Components/Banner';
import HomeStore from './Components/HomeStore';
import TopRated from './Components/TopRated';
import TopSell from './Components/TopSell';

const Home = () => {
   return (
      <section className='home__section'>
         {/* <Banner data={data}></Banner> */}
         <TopRated></TopRated>
         <TopSell></TopSell>
         <HomeStore></HomeStore>
      </section >
   );
};

export default Home;
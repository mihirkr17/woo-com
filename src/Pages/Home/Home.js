import React from 'react';
// import Banner from './Components/Banner';
import HomeStore from './Components/HomeStore';
import CategoryHeader from './Components/CategoryHeader';
import RecommendedProducts from './Components/RecommendedProducts';

const Home = () => {
   return (
      <section className='home__section'>
         <CategoryHeader thisFor={"home"}></CategoryHeader>
         {/* <Banner data={data}></Banner> */}
         <RecommendedProducts></RecommendedProducts>
         <HomeStore></HomeStore>
      </section >
   );
};

export default Home;
import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Banner from './Components/Banner';
import { Container } from 'react-bootstrap';
import HomeStore from './Components/HomeStore';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import CategoryHeader from './Components/CategoryHeader';
import RecentProducts from './Components/RecentProducts';
import { useBASE_URL } from '../../lib/BaseUrlProvider';
import RecommendedProducts from './Components/RecommendedProducts';

const Home = () => {
   const BASE_URL = useBASE_URL();
   const { data, loading } = useFetch(`${BASE_URL}products/`);

   if (loading) return <Spinner></Spinner>;

   return (
      <section className='home__section'>
         <CategoryHeader thisFor={"home"}></CategoryHeader>
         <Banner data={data}></Banner>
         <RecentProducts data={data}></RecentProducts>
         <RecommendedProducts></RecommendedProducts>
         <Container>
            <HomeStore data={data}></HomeStore>
         </Container>
      </section >
   );
};

export default Home;
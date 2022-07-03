import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Banner from './Components/Banner';
import { Container } from 'react-bootstrap';
import HomeStore from './Components/HomeStore';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import CategoryHeader from './Components/CategoryHeader';
import RecentProducts from './Components/RecentProducts';
import { useBASE_URL } from '../../lib/BaseUrlProvider';

const Home = () => {
   const BASE_URL = useBASE_URL();
   const { data, loading } = useFetch(`${BASE_URL}products/`);

   if (loading) return <Spinner></Spinner>;

   return (
      <section className='home__section'>
         <CategoryHeader data={data}></CategoryHeader>
         <Banner data={data}></Banner>
         <RecentProducts data={data}></RecentProducts>
         <Container>
            <HomeStore data={data}></HomeStore>
         </Container>
      </section >
   );
};

export default Home;
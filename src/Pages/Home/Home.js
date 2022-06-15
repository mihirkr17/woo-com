import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Banner from '../../Components/HomeComponents/Banner';
import { Container } from 'react-bootstrap';
import HomeStore from '../../Components/HomeComponents/HomeStore';
import Spinner from '../../Components/Shared/Spinner/Spinner';
import CategoryHeader from '../../Components/HomeComponents/CategoryHeader';
import RecentProducts from '../../Components/HomeComponents/RecentProducts';

const Home = () => {
   const { data, loading } = useFetch('https://woo-com-serve.herokuapp.com/products/');

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
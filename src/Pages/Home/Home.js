import React from 'react';
import { useFetch } from '../../Hooks/useFetch';
import Banner from '../../Components/HomeComponents/Banner';
import { Container } from 'react-bootstrap';
import HomeStore from '../../Components/HomeComponents/HomeStore';

const Home = () => {

   return (
      <section className='home__section'>
         <Container>
            {/* <Banner></Banner> */}
            <HomeStore></HomeStore>
         </Container>
      </section>
   );
};

export default Home;
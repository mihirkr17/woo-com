import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/css/style.css';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './Auth/RequireAuth';
import Home from './Pages/Home/Home';
import Blog from './Pages/Blog';
import Footer from './Components/Shared/Footer';
import NavigationBar from './Components/Shared/NavigationBar';
import Login from './Pages/UserAuth/Login';
import Register from './Pages/Register';
import ViewProduct from './Pages/ViewProduct/ViewProduct';
import Cart from './Pages/Cart/Cart';
import Purchase from './Pages/Purchase/Purchase';

function App() {
  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/blog' element={<Blog></Blog>} ></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/product/:productId' element={<ViewProduct></ViewProduct>}></Route>
        <Route path='/my-cart' element={<RequireAuth><Cart></Cart></RequireAuth>}></Route>
        <Route path='/product/purchase/:productId' element={<Purchase></Purchase>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;

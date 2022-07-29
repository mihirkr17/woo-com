import React, { createContext, useContext, useState } from 'react';
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
import CheckOut from './Pages/CheckOut/CheckOut';
import MyOrder from './Pages/MyOrder/MyOrder';
import ManageOrders from './Admin/ManageOrders/ManageOrders';
import ProductCategory from './Pages/ProductCategory/ProductCategory';
import AllRecentProduct from './Pages/AllRecentProduct/AllRecentProduct';
import SearchProduct from './Components/SearchProduct/SearchProduct';
import Dashboard from './Pages/Dashboard/Dashboard';
import MyProfile from './Pages/Dashboard/MyProfile/MyProfile';
import AllUsers from './Owner/ManageUsers/outlet/AllUsers';
import OwnerData from './Owner/OwnerData/OwnerData';
import AllAdmin from './Owner/ManageUsers/outlet/AllAdmin';
import ManageUsers from './Owner/ManageUsers/ManageUsers';
import RequireOwnerAdmin from './Auth/RequireOwnerAdmin';
import AddProduct from './Pages/Dashboard/AddProduct/AddProduct';
import ManageProduct from './Pages/Dashboard/ManageProduct/ManageProduct';
import MyDashboard from './Pages/Dashboard/MyDashboard/MyDashboard';
import CheckoutSingle from './Pages/CheckOut/CheckoutSingle';
import SellOnline from './Pages/SellOnline/SellOnline';
import CheckSeller from './Pages/Dashboard/CheckSeller/CheckSeller';
import AllSeller from './Owner/ManageUsers/outlet/AllSeller';
import SellerCheckProvider from './lib/SellerCheckProvider';
import { useBASE_URL } from './lib/BaseUrlProvider';
import { useAuthUser } from './lib/UserProvider';
import { useFetch } from './Hooks/useFetch';

// Declare Cart Context
export const CartContext = createContext();

function App() {
  const BASE_URL = useBASE_URL();
  const [query, setQuery] = useState('');
  const user = useAuthUser();

  // fetching cart information and data from mongodb
  const { data : cart, loading, refetch } = useFetch(user && `${BASE_URL}my-cart-items/${user?.email}`);
  return (
    // Wrapping with Cart Provider
    <CartContext.Provider value={{ cart, loading, refetch, cartProductCount: cart?.product && (cart?.product.length || 0)}}>
      <NavigationBar setQuery={setQuery}></NavigationBar>
      <SearchProduct query={query} setQuery={setQuery}></SearchProduct>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/blog' element={<Blog></Blog>} ></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/product/:productId' element={<ViewProduct></ViewProduct>}></Route>
        <Route path='/product/category/:category' element={<ProductCategory></ProductCategory>}></Route>
        <Route path='/product/recent/all' element={<AllRecentProduct></AllRecentProduct>}></Route>
        <Route path='/my-cart' element={<RequireAuth><Cart></Cart></RequireAuth>}></Route>
        <Route path='/product/purchase/:productId' element={<RequireAuth><Purchase></Purchase></RequireAuth>}></Route>
        <Route path='/my-cart/checkout/:cartId' element={<RequireAuth><CheckOut></CheckOut></RequireAuth>}></Route>
        <Route path='/my-cart/checkout-single/:productId' element={<RequireAuth><CheckoutSingle></CheckoutSingle></RequireAuth>}></Route>
        <Route path='/my-profile/my-order' element={<RequireAuth><MyOrder></MyOrder></RequireAuth>}></Route>
        <Route path='/sell-online' element={<RequireAuth><SellOnline></SellOnline></RequireAuth>}></Route>

        {/* // Admin path */}
        <Route path='/dashboard' element={<RequireOwnerAdmin><SellerCheckProvider><Dashboard></Dashboard></SellerCheckProvider> </RequireOwnerAdmin>}>
          <Route index element={<RequireOwnerAdmin><MyDashboard></MyDashboard></RequireOwnerAdmin>}></Route>
          <Route path='my-profile' element={<RequireOwnerAdmin><MyProfile></MyProfile></RequireOwnerAdmin>}></Route>
          <Route path='manage-orders' element={<RequireOwnerAdmin><ManageOrders></ManageOrders></RequireOwnerAdmin>}></Route>
          <Route path='add-product' element={<RequireOwnerAdmin><AddProduct></AddProduct></RequireOwnerAdmin>}></Route>
          <Route path='manage-product' element={<RequireOwnerAdmin><ManageProduct></ManageProduct></RequireOwnerAdmin>}></Route>
          <Route path='check-seller' element={<RequireOwnerAdmin><CheckSeller></CheckSeller></RequireOwnerAdmin>}></Route>

          {/* // Only owner route */}
          <Route path='manage-users' element={<RequireOwnerAdmin><ManageUsers></ManageUsers></RequireOwnerAdmin>}>
            <Route index element={<RequireOwnerAdmin><AllUsers></AllUsers></RequireOwnerAdmin>}></Route>
            <Route path='all-admin' element={<RequireOwnerAdmin><AllAdmin></AllAdmin></RequireOwnerAdmin>}></Route>
            <Route path='all-seller' element={<RequireOwnerAdmin><AllSeller></AllSeller></RequireOwnerAdmin>}></Route>
          </Route>
          <Route path='owner-data' element={<RequireOwnerAdmin><OwnerData></OwnerData></RequireOwnerAdmin>}></Route>
        </Route>

      </Routes>
      <Footer></Footer>
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
export default App;

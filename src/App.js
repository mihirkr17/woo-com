import React, { useContext, useState } from 'react';
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
import Dashboard from './Pages/Dashboard/Dashboard';
import MyProfile from './Pages/Dashboard/MyProfile/MyProfile';
import AllUsers from './Owner/ManageUsers/outlet/AllUsers';
import OwnerData from './Owner/OwnerData/OwnerData';
import AllAdmin from './Owner/ManageUsers/outlet/AllAdmin';
import ManageUsers from './Owner/ManageUsers/ManageUsers';
import RequiredDashboard from './Auth/RequiredDashboard';
import AddProduct from './Pages/Dashboard/AddProduct/AddProduct';
import ManageProduct from './Pages/Dashboard/ManageProduct/ManageProduct';
import MyDashboard from './Pages/Dashboard/MyDashboard/MyDashboard';
import CheckoutSingle from './Pages/CheckOut/CheckoutSingle';
import SellOnline from './Pages/SellOnline/SellOnline';
import CheckSeller from './Pages/Dashboard/CheckSeller/CheckSeller';
import AllSeller from './Owner/ManageUsers/outlet/AllSeller';
import SellerCheckProvider from './lib/SellerCheckProvider';
import CheckOrder from './Pages/Dashboard/CheckOrder/CheckOrder';
import SearchPage from './Pages/SearchPage/SearchPage';
import { useEffect } from 'react';
import NotFound from './Pages/NotFound/NotFound';
import Policy from './Pages/Dashboard/Policy/Policy';
import RequiredSeller from './Auth/RequiredSeller';
import RequiredOwner from './Auth/RequiredOwner';
import RequiredAdmin from "./Auth/RequiredAdmin";
import AuthProvider from './lib/AuthProvider';
import RequiredOwnerAdmin from './Auth/RequiredOwnerAdmin';
import OrderProvider from './lib/OrderProvider';
import UserProvider, { UserContext } from './lib/UserProvider';
import CartProvider, { CartContext } from './lib/CartProvider';

function App() {

  const getTheme = () => {
    return JSON.parse(localStorage.getItem("theme")) || false;
  }
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])


  return (
    <UserProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationBar theme={theme} setTheme={setTheme}></NavigationBar>
          <Routes>
            <Route path='/' element={<Home></Home>} ></Route>
            <Route path='/blog' element={<Blog></Blog>} ></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/search' element={<SearchPage></SearchPage>}></Route>
            
            <Route path='/product/:product_slug' element={<ViewProduct></ViewProduct>}></Route>
            <Route path='/:category' element={<ProductCategory></ProductCategory>}></Route>
            <Route path='/:category/:sub_category' element={<ProductCategory></ProductCategory>}></Route>
            <Route path='/:category/:sub_category/:second_category' element={<ProductCategory></ProductCategory>}></Route>

            <Route path='/my-cart' element={<RequireAuth><Cart></Cart></RequireAuth>}></Route>
            <Route path='/product/purchase/:productId' element={<RequireAuth><Purchase></Purchase></RequireAuth>}></Route>
            <Route path='/my-cart/checkout/:cartId' element={<RequireAuth><CheckOut></CheckOut></RequireAuth>}></Route>
            <Route path='/my-cart/checkout-single/:productId' element={<RequireAuth><CheckoutSingle></CheckoutSingle></RequireAuth>}></Route>
            <Route path='/my-profile/my-order' element={<RequireAuth><MyOrder></MyOrder></RequireAuth>}></Route>
            <Route path='/sell-online' element={<RequireAuth><SellOnline></SellOnline></RequireAuth>}></Route>

            {/* // Admin path */}
            <Route path='/dashboard' element={<RequiredDashboard>
              <SellerCheckProvider>
                <OrderProvider>
                  <Dashboard></Dashboard>
                </OrderProvider>
              </SellerCheckProvider>
            </RequiredDashboard>}>
              <Route index element={<MyDashboard></MyDashboard>}></Route>
              <Route path='my-profile' element={<MyProfile></MyProfile>}></Route>
              <Route path='manage-orders' element={<RequiredAdmin><ManageOrders></ManageOrders></RequiredAdmin>}></Route>
              <Route path='manage-product' element={<ManageProduct></ManageProduct>}></Route>
              <Route path='check-seller' element={<RequiredAdmin><CheckSeller></CheckSeller></RequiredAdmin>}></Route>
              <Route path='privacy-policy' element={<RequiredOwnerAdmin><Policy></Policy></RequiredOwnerAdmin>}></Route>

              {/* // seller routes  */}
              <Route path='add-product' element={<RequiredSeller><AddProduct></AddProduct></RequiredSeller>}></Route>
              <Route path='check-order' element={<RequiredSeller><CheckOrder></CheckOrder></RequiredSeller>}></Route>

              {/* // Only owner route */}
              <Route path='manage-users' element={<RequiredOwnerAdmin><ManageUsers></ManageUsers></RequiredOwnerAdmin>}>
                <Route index element={<AllUsers></AllUsers>}></Route>
                <Route path='all-admin' element={<RequiredOwner><AllAdmin></AllAdmin></RequiredOwner>}></Route>
                <Route path='all-seller' element={<AllSeller></AllSeller>}></Route>
              </Route>

              <Route path='owner-data' element={<RequiredOwner><OwnerData></OwnerData></RequiredOwner>}></Route>
            </Route>
            <Route path='*' element={<NotFound></NotFound>}></Route>
          </Routes>
          <Footer></Footer>
        </CartProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
export const useAuthUser = () => useContext(UserContext);
export const useCart = () => useContext(CartContext);
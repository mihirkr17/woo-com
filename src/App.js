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
import ManageOrders from './Seller/ManageOrders/ManageOrders';
import ProductCategory from './Pages/ProductCategory/ProductCategory';
import Dashboard from './Pages/Dashboard/Dashboard';
import MyProfile from './Pages/Dashboard/MyProfile/MyProfile';
import ManageUsers from './Owner/ManageUsers/ManageUsers';
import RequiredDashboard from './Auth/RequiredDashboard';
import ManageProduct from './Pages/Dashboard/ManageProduct/ManageProduct';
import MyDashboard from './Pages/Dashboard/MyDashboard/MyDashboard';
import CheckoutSingle from './Pages/CheckOut/CheckoutSingle';
import SellOnline from './Pages/SellOnline/SellOnline';
import CheckSeller from './Pages/Dashboard/CheckSeller/CheckSeller';
import SellerCheckProvider from './lib/SellerCheckProvider';
import CheckOrder from './Pages/Dashboard/CheckOrder/CheckOrder';
import SearchPage from './Pages/SearchPage/SearchPage';
import { useEffect } from 'react';
import NotFound from './Pages/NotFound/NotFound';
import Policy from './Pages/Dashboard/Policy/Policy';
import RequiredSeller from './Auth/RequiredSeller';
import RequiredAdmin from "./Auth/RequiredAdmin";
import AuthProvider from './lib/AuthProvider';
import RequiredOwnerAdmin from './Auth/RequiredOwnerAdmin';
import OrderProvider from './lib/OrderProvider';
import UserProvider, { UserContext } from './lib/UserProvider';
import Wishlist from './Pages/Wishlist/Wishlist';
import RequiredUser from './Auth/RequiredUser';

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
    <>
      <UserProvider>
        <AuthProvider>
          <NavigationBar theme={theme} setTheme={setTheme}></NavigationBar>
          <Routes>
            <Route path='/' element={<Home></Home>} ></Route>
            <Route path='/blog' element={<Blog></Blog>} ></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/register' element={<Register></Register>}></Route>
            <Route path='/search' element={<SearchPage></SearchPage>}></Route>

            <Route path='/product/:product_slug' element={<ViewProduct></ViewProduct>}></Route>
            <Route path='/c/:category' element={<ProductCategory></ProductCategory>}></Route>
            <Route path='/c/:category/:sub_category' element={<ProductCategory></ProductCategory>}></Route>
            <Route path='/c/:category/:sub_category/:post_category' element={<ProductCategory></ProductCategory>}></Route>

            <Route path='/my-cart' element={<RequireAuth><RequiredUser><Cart></Cart></RequiredUser></RequireAuth>}></Route>
            <Route path='/product/purchase/:productId' element={<RequireAuth><RequiredUser><Purchase></Purchase></RequiredUser></RequireAuth>}></Route>
            <Route path='/my-cart/checkout/:cartId' element={<RequireAuth><RequiredUser><CheckOut></CheckOut></RequiredUser></RequireAuth>}></Route>
            <Route path='/my-cart/checkout-single/:productId' element={<RequireAuth><RequiredUser><CheckoutSingle></CheckoutSingle></RequiredUser></RequireAuth>}></Route>
            <Route path='/my-profile/my-order' element={<RequireAuth><RequiredUser><MyOrder></MyOrder></RequiredUser></RequireAuth>}></Route>
            <Route path='/sell-online' element={<RequireAuth><SellOnline></SellOnline></RequireAuth>}></Route>
            <Route path='/my-profile/my-wishlist' element={<RequireAuth><Wishlist></Wishlist></RequireAuth>}></Route>

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
              <Route path='manage-product' element={<ManageProduct></ManageProduct>}></Route>


              {/* only admin route */}
              <Route path='check-seller' element={<RequiredAdmin><CheckSeller></CheckSeller></RequiredAdmin>}></Route>

              {/*  seller routes  */}
              <Route path='check-order' element={<RequiredSeller><CheckOrder></CheckOrder></RequiredSeller>}></Route>
              <Route path='manage-orders' element={<RequiredSeller><ManageOrders></ManageOrders></RequiredSeller>}></Route>

              {/* // owner and admin route */}
              <Route path='manage-users' element={<RequiredOwnerAdmin><ManageUsers></ManageUsers></RequiredOwnerAdmin>}></Route>
              <Route path='privacy-policy' element={<RequiredOwnerAdmin><Policy></Policy></RequiredOwnerAdmin>}></Route>
              <Route path='*' element={<NotFound></NotFound>}></Route>
            </Route>

          </Routes>

          <div className="theme_changer">
            <div className='theme_box'>
              <label className="switch">
                <input type="checkbox" checked={theme ? true : ""} onChange={() => setTheme(!theme)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <Footer></Footer>
        </AuthProvider>
      </UserProvider>

    </>
  );
}

export default App;
export const useAuthUser = () => useContext(UserContext);
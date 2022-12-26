import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/css/style.css';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import NotFound from './Pages/NotFound/NotFound';
import Policy from './Pages/Dashboard/Policy/Policy';
import RequiredSeller from './Auth/RequiredSeller';
import RequiredAdmin from "./Auth/RequiredAdmin";
import AuthProvider from './lib/AuthProvider';
import RequiredOwnerAdmin from './Auth/RequiredOwnerAdmin';
import OrderProvider from './lib/OrderProvider';
import { UserContext } from './lib/UserProvider';
import Wishlist from './Pages/Wishlist/Wishlist';
import RequiredUser from './Auth/RequiredUser';
import ManageSellers from './Admin/ManageSellers/ManageSellers';
import NotPermitFor from './Auth/NotPermitFor';
import AddProduct from './Pages/Dashboard/AddProduct/AddProduct';
import AddSingleProduct from './Pages/Dashboard/AddProduct/Components/AddSingleProduct';

function App() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <AuthProvider>
        <NavigationBar></NavigationBar>
        <Routes>
          <Route path='/' element={<NotPermitFor><Home></Home></NotPermitFor>} ></Route>
          <Route path='/blog' element={<Blog></Blog>} ></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/search' element={<SearchPage></SearchPage>}></Route>

          <Route path='/product/:product_slug' element={<NotPermitFor><ViewProduct></ViewProduct></NotPermitFor>}></Route>
          <Route path='/c/:category' element={<NotPermitFor><ProductCategory></ProductCategory></NotPermitFor>}></Route>
          <Route path='/c/:category/:sub_category' element={<NotPermitFor><ProductCategory></ProductCategory></NotPermitFor>}></Route>
          <Route path='/c/:category/:sub_category/:post_category' element={<NotPermitFor><ProductCategory></ProductCategory></NotPermitFor>}></Route>

          <Route path='/my-cart' element={<RequiredUser><Cart></Cart></RequiredUser>}></Route>
          <Route path='/product/purchase/:productId' element={<RequiredUser><Purchase></Purchase></RequiredUser>}></Route>
          <Route path='/my-cart/checkout' element={<RequiredUser><CheckOut></CheckOut></RequiredUser>}></Route>
          <Route path='/my-cart/checkout-single/:productId' element={<RequiredUser><CheckoutSingle></CheckoutSingle></RequiredUser>}></Route>
          <Route path='/my-profile/my-order' element={<RequiredUser><MyOrder></MyOrder></RequiredUser>}></Route>
          <Route path='/sell-online' element={<SellOnline></SellOnline>}></Route>
          <Route path='/my-profile/my-wishlist' element={<RequiredUser><Wishlist></Wishlist></RequiredUser>}></Route>

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
            <Route path='manage-seller' element={<RequiredAdmin><ManageSellers></ManageSellers></RequiredAdmin>} />

            {/*  seller routes  */}
            <Route path='check-order' element={<RequiredSeller><CheckOrder></CheckOrder></RequiredSeller>}></Route>
            <Route path='manage-orders' element={<RequiredSeller><ManageOrders></ManageOrders></RequiredSeller>}></Route>
            <Route path='add-product' element={<RequiredSeller><AddProduct></AddProduct></RequiredSeller>}></Route>

            {/* // owner and admin route */}
            <Route path='manage-users' element={<RequiredOwnerAdmin><ManageUsers></ManageUsers></RequiredOwnerAdmin>}></Route>
            <Route path='privacy-policy' element={<RequiredOwnerAdmin><Policy></Policy></RequiredOwnerAdmin>}></Route>
            <Route path='*' element={<NotFound></NotFound>}></Route>
          </Route>

        </Routes>
        {
          (path !== '/login' && path !== '/register' && !path.startsWith('/dashboard')) && <Footer></Footer>
        }
      </AuthProvider>
    </>
  );
}

export default App;
export const useAuthUser = () => useContext(UserContext);
import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/css/style.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Blog from './Pages/Blog';
import Footer from './Components/Shared/Footer';
import NavigationBar from './Components/Shared/NavigationBar';
import Login from './Pages/UserAuth/Login';
import Register from './Pages/Register';
import ViewProduct from './Pages/ViewProduct/ViewProduct';
import Cart from './Pages/Cart/Cart';
import MyOrder from './Pages/UserAccount/MyOrder';
import ManageOrders from './Pages/Dashboard/ManageOrders/ManageOrders';
import ProductCategory from './Pages/ProductCategory/ProductCategory';
import Dashboard from './Pages/Dashboard/Dashboard';
import MyProfile from './Pages/Dashboard/MyProfile/MyProfile';
import ManageUsers from './Owner/ManageUsers/ManageUsers';
import RequiredDashboard from './Auth/RequiredDashboard';
import ManageProduct from './Pages/Dashboard/ManageProduct/ManageProduct';
import MyDashboard from './Pages/Dashboard/MyDashboard/MyDashboard';
import SellOnline from './Pages/SellOnline/SellOnline';
import CheckSeller from './Pages/Dashboard/CheckSeller/CheckSeller';
import SellerCheckProvider from './lib/SellerCheckProvider';
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
import RequiredBuyer from './Auth/RequiredBuyer';
import ManageSellers from './Admin/ManageSellers/ManageSellers';
import NotPermitForAdminSellerOwner from './Auth/NotPermitForAdminSellerOwner';
import AddProduct from './Pages/Dashboard/AddProduct/AddProduct';
import UserAccount from './Pages/UserAccount/UserAccount';
import MyAddressBook from './Pages/UserAccount/MyAddressBook';
import Profile from './Pages/UserAccount/Profile';
import MyPayment from './Pages/UserAccount/MyPayment';
import AdminProvider from './lib/AdminProvider';
import CheckAllIncomingProductListing from './Pages/Dashboard/Admin/CheckAllIncomingProductListing';
import CartProvider from './lib/CartProvider';
import SinglePurchase from './Pages/Purchase/SinglePurchase';
import CartPurchase from './Pages/Purchase/CartPurchase';

function App() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <AuthProvider>
        <NavigationBar></NavigationBar>

        <Routes>

          {/* Only Buyer Routes */}
          <Route path='/user/my-account' element={<RequiredBuyer><UserAccount></UserAccount></RequiredBuyer>}>
            <Route index element={<Profile></Profile>}></Route>
            <Route path='address-book' element={<MyAddressBook></MyAddressBook>}></Route>
            <Route path='payment-management' element={<MyPayment></MyPayment>}></Route>
            <Route path='orders-management' element={<MyOrder></MyOrder>}></Route>
          </Route>

          <Route
            path='/my-cart'
            element={
              <RequiredBuyer>
                <CartProvider>
                  <Cart></Cart>
                </CartProvider>
              </RequiredBuyer>
            }
          />

          <Route
            path='/checkout'
            element={
              <RequiredBuyer>
                <CartPurchase>
                </CartPurchase>
              </RequiredBuyer>
            }
          />

          <Route path='/single-checkout' element={<RequiredBuyer><SinglePurchase></SinglePurchase></RequiredBuyer>}></Route>

          <Route path='/' element={<NotPermitForAdminSellerOwner><Home></Home></NotPermitForAdminSellerOwner>}></Route>
          <Route path='/blog' element={<Blog></Blog>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/search' element={<SearchPage></SearchPage>}></Route>

          <Route path='/product/:product_slug' element={<NotPermitForAdminSellerOwner><ViewProduct></ViewProduct></NotPermitForAdminSellerOwner>}></Route>
          <Route path='/c/:category' element={<NotPermitForAdminSellerOwner><ProductCategory></ProductCategory></NotPermitForAdminSellerOwner>}></Route>
          <Route path='/c/:category/:sub_category' element={<NotPermitForAdminSellerOwner><ProductCategory></ProductCategory></NotPermitForAdminSellerOwner>}></Route>
          <Route path='/c/:category/:sub_category/:post_category' element={<NotPermitForAdminSellerOwner><ProductCategory></ProductCategory></NotPermitForAdminSellerOwner>}></Route>

          <Route path='/sell-online' element={<SellOnline></SellOnline>}></Route>
          <Route path='/my-profile/my-wishlist' element={<RequiredBuyer><Wishlist></Wishlist></RequiredBuyer>}></Route>

          {/* ADMIN, SELLER, OWNER Routes */}
          <Route path='/dashboard' element={<RequiredDashboard>

            <SellerCheckProvider>
              <OrderProvider>
                <AdminProvider>
                  <Dashboard></Dashboard>
                </AdminProvider>
              </OrderProvider>
            </SellerCheckProvider>
          </RequiredDashboard>}>

            <Route index element={<MyDashboard></MyDashboard>}></Route>
            <Route path='my-profile' element={<MyProfile></MyProfile>}></Route>
            <Route path='manage-product' element={<ManageProduct></ManageProduct>}></Route>


            {/* only admin route */}
            <Route path='check-seller' element={<RequiredAdmin><CheckSeller></CheckSeller></RequiredAdmin>}></Route>
            <Route path='manage-seller' element={<RequiredAdmin><ManageSellers></ManageSellers></RequiredAdmin>} />
            <Route path='check-all-incoming-listing' element={<RequiredAdmin>
              <CheckAllIncomingProductListing></CheckAllIncomingProductListing>
            </RequiredAdmin>}>

            </Route>

            {/*  seller routes  */}
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
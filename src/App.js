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
import { useFetch } from './Hooks/useFetch';
import CheckOrder from './Pages/Dashboard/CheckOrder/CheckOrder';
import useAuth from './Hooks/useAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase.init';
import Spinner from './Components/Shared/Spinner/Spinner';
import SearchPage from './Pages/SearchPage/SearchPage';
import { useEffect } from 'react';
import NotFound from './Pages/NotFound/NotFound';
import Policy from './Pages/Dashboard/Policy/Policy';
import RequireSeller from './Auth/RequireSeller';
import RequiredOwner from './Auth/RequiredOwner';

export const UserContext = createContext();

// Declare Cart Context
export const CartContext = createContext();

// Declare order context
export const OrderContext = createContext();

function App() {
  const [user, loading] = useAuthState(auth);
  const { role, userInfo } = useAuth(user);

  const getTheme = () => {
    return JSON.parse(localStorage.getItem("theme")) || false;
  }
  const [theme, setTheme] = useState(getTheme());

  // fetching cart information and data from mongodb
  const { data: cart, cartLoading, refetch } = useFetch(user && `${process.env.REACT_APP_BASE_URL}my-cart-items/${user?.email}`);

  let url = role === "seller" ? `${process.env.REACT_APP_BASE_URL}manage-orders?seller=${userInfo?.seller}` :
    `${process.env.REACT_APP_BASE_URL}manage-orders`;
  // fetching order information and data from mongodb
  const { data: order, loading: orderLoading, refetch: orderRefetch } = useFetch(url);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])

  if (loading) {
    return <Spinner></Spinner>
  }
  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider value={{ cart, cartLoading, refetch, cartProductCount: cart?.product && (cart?.product.length || 0) }}>
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
          <Route path='/dashboard' element={<RequireOwnerAdmin>
            <SellerCheckProvider>
              <OrderContext.Provider value={{ order, orderLoading, orderRefetch, orderCount: order ? order.length : 0 }}>
                <Dashboard></Dashboard>
              </OrderContext.Provider>
            </SellerCheckProvider>
          </RequireOwnerAdmin>}>
            <Route index element={<RequireOwnerAdmin><MyDashboard></MyDashboard></RequireOwnerAdmin>}></Route>
            <Route path='my-profile' element={<RequireOwnerAdmin><MyProfile></MyProfile></RequireOwnerAdmin>}></Route>
            <Route path='manage-orders' element={<RequireOwnerAdmin><ManageOrders></ManageOrders></RequireOwnerAdmin>}></Route>
            <Route path='manage-product' element={<RequireOwnerAdmin><ManageProduct></ManageProduct></RequireOwnerAdmin>}></Route>
            <Route path='check-seller' element={<RequireOwnerAdmin><CheckSeller></CheckSeller></RequireOwnerAdmin>}></Route>
            <Route path='privacy-policy' element={<RequireOwnerAdmin><Policy></Policy></RequireOwnerAdmin>}></Route>

            {/* // seller routes  */}
            <Route path='add-product' element={<RequireSeller><AddProduct></AddProduct></RequireSeller>}></Route>
            <Route path='check-order' element={<RequireSeller><CheckOrder></CheckOrder></RequireSeller>}></Route>


            {/* // Only owner route */}
            <Route path='manage-users' element={<RequireOwnerAdmin><ManageUsers></ManageUsers></RequireOwnerAdmin>}>
              <Route index element={<RequireOwnerAdmin><AllUsers></AllUsers></RequireOwnerAdmin>}></Route>
              <Route path='all-admin' element={<RequireOwnerAdmin><AllAdmin></AllAdmin></RequireOwnerAdmin>}></Route>
              <Route path='all-seller' element={<RequireOwnerAdmin><AllSeller></AllSeller></RequireOwnerAdmin>}></Route>
            </Route>

            <Route path='owner-data' element={<RequiredOwner><OwnerData></OwnerData></RequiredOwner>}></Route>
          </Route>
          <Route path='*' element={<NotFound></NotFound>}></Route>

        </Routes>
        <Footer></Footer>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
export const useAuthUser = () => useContext(UserContext);
export const useCart = () => useContext(CartContext);
export const useOrder = () => useContext(OrderContext);
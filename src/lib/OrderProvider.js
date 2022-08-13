import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
   const { role, userInfo } = useAuthContext();
   let url = role === "seller" ? `${process.env.REACT_APP_BASE_URL}manage-orders?seller=${userInfo?.seller}` :
      `${process.env.REACT_APP_BASE_URL}manage-orders`;
   // fetching order information and data from mongodb
   const { data: order, loading: orderLoading, refetch: orderRefetch } = useFetch(url);


   return (
      <OrderContext.Provider value={{ order, orderLoading, orderRefetch, orderCount: order ? order.length : 0 }}>
         {children}
      </OrderContext.Provider>
   );
};

export const useOrder = () => useContext(OrderContext);
export default OrderProvider;
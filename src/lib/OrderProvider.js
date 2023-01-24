import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
   const { role, userInfo } = useAuthContext();
   let url = role === 'SELLER' && `${process.env.REACT_APP_BASE_URL}api/v1/order/manage-orders?storeName=${userInfo?.seller?.storeInfos?.storeName}`;
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
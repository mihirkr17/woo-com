import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {

   const { userInfo, role } = useAuthContext();

   let url = `${process.env.REACT_APP_BASE_URL}api/v1/dashboard/overview`;

   const { data, loading, refetch } = useFetch(url);

   return (
      <DashboardContext.Provider value={{ data, loading, refetch }}>
         {children}
      </DashboardContext.Provider>
   );
};

export const useOrder = () => useContext(DashboardContext);
export default DashboardProvider;
import React from 'react';
import { useReducer } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const SellerCheckContext = createContext();

const reducer = (state, action) => {

   if (action.type === "INIT_CHECKER") {
      return { ...state, data: action.payload.data, slLength: action.payload.slLength }
   }
}



const SellerCheckProvider = ({ children }) => {

   const { userInfo } = useAuthContext();

   const url = userInfo?.role === 'ADMIN' && `${process.env.REACT_APP_BASE_URL}api/v1/user/check-seller-request`;
   const { data, refetch, loading } = useFetch(url);

   const initialState = {
      data: [],
      slLength: 0
   }
   
   const [state, dispatch] = useReducer(reducer, initialState);

   useEffect(() => {
      dispatch({ type: "INIT_CHECKER", payload: { data: data && data.data, slLength: data && data?.data.length } })
   }, [data]);

   return (
      <SellerCheckContext.Provider value={{ state, dispatch, refetch, loading }}>
         {children}
      </SellerCheckContext.Provider>
   );
};

export const useSellerChecker = () => useContext(SellerCheckContext);

export default SellerCheckProvider;
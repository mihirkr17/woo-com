import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
export const BaseUrlContext = createContext();

const BaseUrlProvider = ({ children }) => {
   // const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/';
   const BASE_URL = 'http://localhost:5000/';
   return (
      <BaseUrlContext.Provider value={BASE_URL}>
         {children}
      </BaseUrlContext.Provider>
   )
};

export const useBASE_URL = () => useContext(BaseUrlContext);
export default BaseUrlProvider;
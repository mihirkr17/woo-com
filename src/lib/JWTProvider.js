import React from 'react';
import { createContext } from 'react';
export const JWTContext = createContext();

const JWTProvider = ({ children }) => {
   const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"));
   const token = cookieObj.get('accessToken');
   return (
      <JWTContext.Provider value={token}>
         {children}
      </JWTContext.Provider>
   )
};

export default JWTProvider;
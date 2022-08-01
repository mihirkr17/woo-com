import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './lib/UserProvider';
import BaseUrlProvider from './lib/BaseUrlProvider';
import JWTProvider from './lib/JWTProvider';
import AuthProvider from './lib/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <BaseUrlProvider>
      <UserProvider>
        <JWTProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </JWTProvider>
      </UserProvider>
    </BaseUrlProvider>
  </BrowserRouter>
);
reportWebVitals();

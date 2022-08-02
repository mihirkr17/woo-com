import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './lib/UserProvider';
import BaseUrlProvider from './lib/BaseUrlProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <BaseUrlProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </BaseUrlProvider>
  </BrowserRouter>
);
reportWebVitals();

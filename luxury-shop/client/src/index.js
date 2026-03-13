import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import { GeneralContextProvider } from './context/GeneralContext';
import reportWebVitals from './reportWebVitals';

// ── Global axios interceptor: attach x-user-id to every request ──
axios.interceptors.request.use(config => {
  const userId = localStorage.getItem('userId');
  if (userId) config.headers['x-user-id'] = userId;
  return config;
}, error => Promise.reject(error));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <GeneralContextProvider>
      <App />
    </GeneralContextProvider>
  </BrowserRouter>
);

reportWebVitals();

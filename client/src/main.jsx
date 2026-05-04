import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios' 

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Verificamos si es un error 401
    if (error.response && error.response.status === 401) {
      
      // 2. IMPORTANTE: Verificamos que la ruta NO sea la de login
      // Si el error 401 viene del login, NO redireccionamos para permitir ver el mensaje
      const isLoginRequest = error.config.url.includes('/api/auth/login');

      if (!isLoginRequest) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
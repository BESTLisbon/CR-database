// AxiosInterceptorSetup.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../config/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const AxiosInterceptorSetup: React.FC = () => {
  const { state, refresh } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (config.skipAuthInterceptor) {
          delete config.skipAuthInterceptor;
          return config;
        }
        
        if (!state) return config; // Not logged in
        
        let token = state.auth.accessToken;
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded.exp! + 5 * 60 * 1000 <= Date.now()) {
            await refresh();
            token = localStorage.getItem('auth')
              ? JSON.parse(localStorage.getItem('auth')!).accessToken
              : null;
          }

          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            config.headers = { Authorization: `Bearer ${token}` };
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [state, refresh]);

  return null;
};

export default AxiosInterceptorSetup;

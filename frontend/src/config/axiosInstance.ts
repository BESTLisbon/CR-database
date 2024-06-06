import axios from 'axios';

// Add an optional "skip interceptor" to the request configs.
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthInterceptor?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


export { axiosInstance };

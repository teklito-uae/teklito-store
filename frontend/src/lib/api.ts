import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

  const transformKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(v => transformKeys(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce((result, key) => {
        result[toCamelCase(key)] = transformKeys(obj[key]);
        return result;
      }, {} as any);
    }
    return obj;
  };
  
  // Handle 401 globally and apply camelCase formatting
  api.interceptors.response.use(
    (response) => {
      if (response.data) {
        response.data = transformKeys(response.data);
      }
      return response;
    },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

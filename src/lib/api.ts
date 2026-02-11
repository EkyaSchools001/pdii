import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Unauthorized - clear storage and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
                toast.error('Session expired. Please log in again.');
            }
        } else if (status === 403) {
            toast.error('You do not have permission to perform this action.');
        } else if (status === 404) {
            toast.error('Resource not found.');
        } else if (status === 500) {
            toast.error('Internal server error. Please try again later.');
        } else if (!status) {
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default api;

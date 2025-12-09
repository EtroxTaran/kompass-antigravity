import axios, { InternalAxiosRequestConfig } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token'); // Simplification or useAuth context
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

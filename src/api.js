// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin'; // Adjust the base URL as needed

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Use the token from localStorage
    }
});

export const fetchUsers = () => api.get('/users');
export const updateUser = (id, data) => api.patch(`/user/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/${id}`);

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);
export const recoverPassword = (data) => api.post('/api/auth/recover-password', data);

// User
export const getProfile = () => api.get('/api/users/profile');
export const updateProfile = (data) => api.put('/api/users/profile', data);
export const changePassword = (data) => api.put('/api/users/change-password', data);

// Catalog
export const getCategories = () => api.get('/api/categories');
export const getProducts = (params) => api.get('/api/products', { params });
export const getProductById = (id) => api.get(`/api/products/${id}`);

// Cart
export const getCart = () => api.get('/api/cart');
export const addToCart = (data) => api.post('/api/cart/items', data);
export const updateCartItem = (id, quantity) => api.put(`/api/cart/items/${id}`, null, { params: { quantity } });
export const removeCartItem = (id) => api.delete(`/api/cart/items/${id}`);
export const clearCart = () => api.delete('/api/cart');
export const mergeCart = (items) => api.post('/api/cart/merge', items);

// Orders
export const getMyOrders = () => api.get('/api/orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const checkout = (data) => api.post('/api/orders', data);
export const cancelOrder = (id) => api.put(`/api/orders/${id}/cancel`);

// Pages
export const getPage = (name) => api.get(`/api/pages/${name}`);

// Admin
export const getDashboardStats = () => api.get('/api/admin/dashboard');
export const getAdminUsers = () => api.get('/api/admin/users');
export const addAdminUser = (data) => api.post('/api/admin/users', data);
export const updateAdminUser = (id, data) => api.put(`/api/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getSalesReport = (startDate, endDate) => api.get('/api/admin/reports', { params: { startDate, endDate } });
export const getSalesTrend = (startDate, endDate) => api.get('/api/admin/sales-trend', { params: { startDate, endDate } });

export const getAdminOrders = () => api.get('/api/admin/orders');
export const searchOrderByNumber = (orderNumber) => api.get('/api/admin/orders/search', { params: { orderNumber } });
export const updateOrderStatus = (id, status) => api.put(`/api/admin/orders/${id}/status`, { status });

export const addCategory = (data) => api.post('/api/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/api/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`);

export const addProduct = (data) => api.post('/api/admin/products', data);
export const updateProduct = (id, data) => api.put(`/api/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);
export const uploadProductImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/admin/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updatePage = (name, data) => api.put(`/api/admin/pages/${name}`, data);

export default api;

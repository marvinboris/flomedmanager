import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const dashboardService = {
  getData: () => api.get('/dashboard'),
};

export const medicamentService = {
  getAll: (params) => api.get('/medicaments', { params }),
  getOne: (id) => api.get(`/medicaments/${id}`),
  create: (data) => api.post('/medicaments', data),
  update: (id, data) => api.put(`/medicaments/${id}`, data),
  delete: (id) => api.delete(`/medicaments/${id}`),
  getCategories: () => api.get('/medicaments/categories'),
  getLowStock: () => api.get('/medicaments/low-stock'),
  getExpiringSoon: () => api.get('/medicaments/expiring-soon'),
  getExpired: () => api.get('/medicaments/expired'),
};

export const stockService = {
  getAll: (params) => api.get('/stocks', { params }),
  getOne: (id) => api.get(`/stocks/${id}`),
  update: (id, data) => api.put(`/stocks/${id}`, data),
  movement: (data) => api.post('/stocks/movement', data),
  history: (params) => api.get('/stocks/history', { params }),
};

export const fournisseurService = {
  getAll: (params) => api.get('/fournisseurs', { params }),
  getOne: (id) => api.get(`/fournisseurs/${id}`),
  create: (data) => api.post('/fournisseurs', data),
  update: (id, data) => api.put(`/fournisseurs/${id}`, data),
  delete: (id) => api.delete(`/fournisseurs/${id}`),
  getAllList: () => api.get('/fournisseurs/all'),
};

export const commandeService = {
  getAll: (params) => api.get('/commandes', { params }),
  getOne: (id) => api.get(`/commandes/${id}`),
  create: (data) => api.post('/commandes', data),
  update: (id, data) => api.put(`/commandes/${id}`, data),
  delete: (id) => api.delete(`/commandes/${id}`),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles'),
};

export const rapportService = {
  exportStockPdf: () => api.get('/rapports/stock/pdf', { responseType: 'blob' }),
  exportStockExcel: () => api.get('/rapports/stock/excel', { responseType: 'blob' }),
  exportExpiredPdf: () => api.get('/rapports/expired/pdf', { responseType: 'blob' }),
  exportExpiredExcel: () => api.get('/rapports/expired/excel', { responseType: 'blob' }),
  exportMovementsPdf: (params) => api.get('/rapports/movements/pdf', { params, responseType: 'blob' }),
  exportMovementsExcel: (params) => api.get('/rapports/movements/excel', { params, responseType: 'blob' }),
  exportCommandesPdf: (params) => api.get('/rapports/commandes/pdf', { params, responseType: 'blob' }),
  exportCommandesExcel: (params) => api.get('/rapports/commandes/excel', { params, responseType: 'blob' }),
};

export default api;

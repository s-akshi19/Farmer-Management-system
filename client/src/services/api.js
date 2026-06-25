import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api', withCredentials: true });
api.interceptors.request.use(cfg => { const t = localStorage.getItem('fm_token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });
api.interceptors.response.use(r => r, err => { if (err.response?.status === 401) { localStorage.removeItem('fm_token'); localStorage.removeItem('fm_user'); } return Promise.reject(err); });
export default api;

export const authService = {
  login: d => api.post('/auth/login', d).then(r => r.data),
  register: d => api.post('/auth/register', d).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
};

export const farmerService = {
  getAll: p => api.get('/farmers', { params: p }).then(r => r.data),
  getOne: id => api.get(`/farmers/${id}`).then(r => r.data),
  create: d => api.post('/farmers', d).then(r => r.data),
  update: (id, d) => api.put(`/farmers/${id}`, d).then(r => r.data),
  delete: id => api.delete(`/farmers/${id}`).then(r => r.data),
  getStats: () => api.get('/farmers/stats').then(r => r.data),
  addLand: (fid, d) => api.post(`/farmers/${fid}/lands`, d).then(r => r.data),
  updateLand: (id, d) => api.put(`/farmers/lands/${id}`, d).then(r => r.data),
  deleteLand: id => api.delete(`/farmers/lands/${id}`).then(r => r.data),
  addCrop: (fid, d) => api.post(`/farmers/${fid}/crops`, d).then(r => r.data),
  updateCrop: (id, d) => api.put(`/farmers/crops/${id}`, d).then(r => r.data),
  deleteCrop: id => api.delete(`/farmers/crops/${id}`).then(r => r.data),
};

export const marketService = {
  getPrices: p => api.get('/market', { params: p }).then(r => r.data),
  addPrice: d => api.post('/market', d).then(r => r.data),
  deletePrice: id => api.delete(`/market/${id}`).then(r => r.data),
};

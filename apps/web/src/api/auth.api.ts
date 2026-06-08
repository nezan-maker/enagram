import api from './axios';

export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  staffLogin: (data: { staffId: string; password: string }) =>
    api.post('/auth/staff/login', data),
  refresh: () =>
    api.post('/auth/refresh', {}),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

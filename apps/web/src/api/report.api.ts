import api from './axios';

export const reportApi = {
  create: (restaurantId: string, data: Record<string, unknown>) =>
    api.post(`/restaurants/${restaurantId}/reports`, data),
  list: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/reports`),
  dashboard: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/reports/dashboard`),
  financial: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/reports/financial`),
};

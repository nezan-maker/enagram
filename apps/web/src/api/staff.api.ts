import api from './axios';

export const staffApi = {
  create: (restaurantId: string, data: Record<string, unknown>) =>
    api.post(`/restaurants/${restaurantId}/staff`, data),
  bulkEnroll: (restaurantId: string, formData: FormData) =>
    api.post(`/restaurants/${restaurantId}/staff/bulk`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (restaurantId: string, userId: string) =>
    api.get(`/restaurants/${restaurantId}/staff/${userId}`),
  deactivate: (restaurantId: string, userId: string) =>
    api.patch(`/restaurants/${restaurantId}/staff/${userId}/deactivate`),
};

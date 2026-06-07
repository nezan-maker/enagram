import api from './axios';

export const tableApi = {
  list: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/tables`),
  create: (restaurantId: string, data: { tableNumber: string; capacity: number }) =>
    api.post(`/restaurants/${restaurantId}/tables`, data),
  update: (restaurantId: string, tableId: string, data: Record<string, unknown>) =>
    api.patch(`/restaurants/${restaurantId}/tables/${tableId}`, data),
  remove: (restaurantId: string, tableId: string) =>
    api.delete(`/restaurants/${restaurantId}/tables/${tableId}`),
  getQR: (restaurantId: string, tableId: string) =>
    api.get(`/restaurants/${restaurantId}/tables/${tableId}/qr`),
};

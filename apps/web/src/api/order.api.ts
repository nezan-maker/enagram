import api from './axios';

export const orderApi = {
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  listByRestaurant: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/orders`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  markPaid: (id: string) => api.patch(`/orders/${id}/pay`),
  cancel: (id: string) => api.delete(`/orders/${id}`),
};

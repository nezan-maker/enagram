import api from './axios';

export const reservationApi = {
  create: (restaurantId: string, data: { partySize: number; reservedAt: string; notes?: string }) =>
    api.post(`/restaurants/${restaurantId}/reservations`, data),
  list: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/reservations`),
  updateStatus: (restaurantId: string, id: string, status: string) =>
    api.patch(`/restaurants/${restaurantId}/reservations/${id}`, { status }),
  cancel: (restaurantId: string, id: string) =>
    api.delete(`/restaurants/${restaurantId}/reservations/${id}`),
};

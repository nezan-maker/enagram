import api from './axios';

export const reviewApi = {
  create: (restaurantId: string, data: { rating: number; comment?: string }) =>
    api.post(`/restaurants/${restaurantId}/reviews`, data),
  list: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/reviews`),
  remove: (restaurantId: string, id: string) =>
    api.delete(`/restaurants/${restaurantId}/reviews/${id}`),
};

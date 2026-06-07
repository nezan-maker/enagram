import api from './axios';

export const menuApi = {
  list: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/menus`),
  getById: (restaurantId: string, menuId: string) => api.get(`/restaurants/${restaurantId}/menus/${menuId}`),
  create: (restaurantId: string, data: { name: string; description?: string }) =>
    api.post(`/restaurants/${restaurantId}/menus`, data),
  update: (restaurantId: string, menuId: string, data: Record<string, unknown>) =>
    api.patch(`/restaurants/${restaurantId}/menus/${menuId}`, data),
  delete: (restaurantId: string, menuId: string) =>
    api.delete(`/restaurants/${restaurantId}/menus/${menuId}`),
  addItem: (restaurantId: string, menuId: string, data: Record<string, unknown>) =>
    api.post(`/restaurants/${restaurantId}/menus/${menuId}/items`, data),
  updateItem: (restaurantId: string, menuId: string, itemId: string, data: Record<string, unknown>) =>
    api.patch(`/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}`, data),
  deleteItem: (restaurantId: string, menuId: string, itemId: string) =>
    api.delete(`/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}`),
  approveItem: (restaurantId: string, menuId: string, itemId: string) =>
    api.patch(`/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}/approve`),
};

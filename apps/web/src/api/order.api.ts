import api from './axios';

export interface CreateOrderPayload {
  restaurantId: string;
  type: 'DINE_IN' | 'DELIVERY';
  items: { menuItemId: string; name: string; price: number; quantity: number }[];
  tableId?: string;
  notes?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
}

export const orderApi = {
  create: (data: CreateOrderPayload) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  listByRestaurant: (restaurantId: string, status?: string) =>
    api.get(`/orders/restaurant/${restaurantId}`, { params: { status } }),
  listByClient: () => api.get('/orders/client/me'),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  markPaid: (id: string, paymentMethod?: string) => api.patch(`/orders/${id}/pay`, { paymentMethod }),
  cancel: (id: string) => api.delete(`/orders/${id}`),
};

export default orderApi;

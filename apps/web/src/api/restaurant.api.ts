import api from './axios';

export const restaurantApi = {
  list: () => api.get('/restaurants'),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  /** Fetch all and find by slug — server doesn't have a dedicated slug endpoint */
  getBySlug: async (slug: string) => {
    const res = await api.get('/restaurants');
    const data = res.data?.data || res.data || [];
    return Array.isArray(data) ? data.find((r: any) => r.slug === slug) : null;
  },
  create: (data: Record<string, unknown>) => api.post('/restaurants', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/restaurants/${id}`, data),
  toggle: (id: string) => api.patch(`/restaurants/${id}/toggle`),
  delete: (id: string) => api.delete(`/restaurants/${id}`),
  getStaff: (id: string) => api.get(`/restaurants/${id}/staff`),
  uploadMedia: (id: string, formData: FormData) =>
    api.post(`/restaurants/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

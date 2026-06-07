import api from './axios';

export const issueApi = {
  create: (data: Record<string, unknown>) => api.post('/issues', data),
  list: (restaurantId?: string) => api.get('/issues', { params: { restaurantId } }),
  listMine: () => api.get('/issues/mine'),
  getById: (id: string) => api.get(`/issues/${id}`),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/issues/${id}`, data),
  assign: (id: string, assigneeId: string) => api.patch(`/issues/${id}/assign`, { assigneeId }),
};

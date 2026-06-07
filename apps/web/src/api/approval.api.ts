import api from './axios';

export const approvalApi = {
  create: (data: Record<string, unknown>) => api.post('/approvals', data),
  list: () => api.get('/approvals'),
  resolve: (id: string, data: { status: string; notes?: string }) =>
    api.patch(`/approvals/${id}/resolve`, data),
};

import api from './axios';

export const messageApi = {
  getConversation: (userId: string) => api.get(`/messages/${userId}`),
  listConversations: () => api.get('/messages/conversations'),
  markRead: (userId: string) => api.patch(`/messages/${userId}/read`),
};

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { Notification } from '../models/Notification.model.js';
import { createClient, signToken, authHeader } from './helpers.js';

describe('🔔 Notification Endpoints', () => {
  it('lists own notifications (empty)', async () => {
    const user = await createClient();
    const token = await signToken(user._id.toString(), user.role);
    const res = await request(app).get('/api/v1/notifications').set(authHeader(token));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('marks notification as read', async () => {
    const user = await createClient();
    const notif = await Notification.create({ recipientId: user._id, type: 'ORDER', title: 'Test', body: 'Test body' });
    const token = await signToken(user._id.toString(), user.role);
    const res = await request(app).patch(`/api/v1/notifications/${notif._id}/read`).set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('marks all as read', async () => {
    const user = await createClient();
    await Notification.create({ recipientId: user._id, type: 'ORDER', title: 'A', body: 'Body A' });
    await Notification.create({ recipientId: user._id, type: 'ISSUE', title: 'B', body: 'Body B' });
    const token = await signToken(user._id.toString(), user.role);
    const res = await request(app).patch('/api/v1/notifications/read-all').set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

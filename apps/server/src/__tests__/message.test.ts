import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createWaiter, createRestaurant, signToken, authHeader } from './helpers.js';

describe('💬 Message Endpoints', () => {
  it('lists conversations', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const waiter = await createWaiter(rest._id);
    const token = await signToken(waiter._id.toString(), 'WAITER');
    const res = await request(app).get('/api/v1/messages/conversations').set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('gets conversation with user', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const waiter = await createWaiter(rest._id);
    const token = await signToken(waiter._id.toString(), 'WAITER');
    const res = await request(app).get(`/api/v1/messages/${owner._id}`).set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createWaiter, createRestaurant, signToken, authHeader } from './helpers.js';

describe('🪑 Table Endpoints', () => {
  it('creates a table', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), owner.role);
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/tables`)
      .set(authHeader(token))
      .send({ tableNumber: 'T1', capacity: 4 });
    expect(res.status).toBe(201);
    expect(res.body.data.tableNumber).toBe('T1');
  });

  it('lists tables', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), owner.role);
    await request(app).post(`/api/v1/restaurants/${rest._id}/tables`)
      .set(authHeader(token)).send({ tableNumber: 'T1', capacity: 4 });
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/tables`)
      .set(authHeader(token));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects waiter from creating table', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const waiter = await createWaiter(rest._id);
    const token = await signToken(waiter._id.toString(), waiter.role);
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/tables`)
      .set(authHeader(token))
      .send({ tableNumber: 'T2', capacity: 2 });
    expect(res.status).toBe(403);
  });
});

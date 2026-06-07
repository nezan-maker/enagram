import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createRestaurant, signToken, authHeader } from './helpers.js';

describe('📊 Report Endpoints', () => {
  it('creates a report', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/reports`)
      .set(authHeader(token))
      .send({ type: 'OPERATIONAL', period: { from: '2026-01-01', to: '2026-01-31' }, data: { orders: 100 }, summary: 'Monthly ops report' });
    expect(res.status).toBe(201);
  });

  it('gets financial report', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/reports/financial`).set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('gets dashboard data', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/reports/dashboard`).set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

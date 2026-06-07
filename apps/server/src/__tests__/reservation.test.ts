import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createClient, createRestaurant, signToken, authHeader } from './helpers.js';

describe('📅 Reservation Endpoints', () => {
  it('creates a reservation', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const client = await createClient();
    const token = await signToken(client._id.toString(), 'CLIENT');
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/reservations`)
      .set(authHeader(token))
      .send({ partySize: 4, reservedAt: new Date(Date.now() + 86400000).toISOString() });
    expect(res.status).toBe(201);
  });

  it('lists reservations', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), owner.role);
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/reservations`).set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('rejects unauthenticated list', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/reservations`);
    expect(res.status).toBe(401);
  });
});

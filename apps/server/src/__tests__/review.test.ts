import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createClient, createRestaurant, signToken, authHeader } from './helpers.js';

describe('⭐ Review Endpoints', () => {
  it('creates a review', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const client = await createClient();
    const token = await signToken(client._id.toString(), 'CLIENT');
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/reviews`)
      .set(authHeader(token))
      .send({ rating: 5, comment: 'Excellent!' });
    expect(res.status).toBe(201);
  });

  it('lists reviews (public)', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/reviews`);
    expect(res.status).toBe(200);
  });
});

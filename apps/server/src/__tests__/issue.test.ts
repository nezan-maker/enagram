import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createClient, createRestaurant, signToken, authHeader } from './helpers.js';

describe('⚠️ Issue Endpoints', () => {
  it('creates an issue', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const client = await createClient();
    const token = await signToken(client._id.toString(), 'CLIENT');
    const res = await request(app)
      .post('/api/v1/issues')
      .set(authHeader(token))
      .send({ title: 'Broken AC', description: 'AC not working', category: 'MAINTENANCE', channel: 'CLIENT', restaurantId: rest._id, priority: 'HIGH' });
    expect(res.status).toBe(201);
  });

  it('lists issues as deputy', async () => {
    const owner = await createOwner();
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app).get('/api/v1/issues').set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

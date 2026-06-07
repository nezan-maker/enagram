import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createRestaurant, signToken, authHeader } from './helpers.js';

describe('✅ Approval Endpoints', () => {
  it('creates an approval request', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app)
      .post('/api/v1/approvals')
      .set(authHeader(token))
      .send({ restaurantId: rest._id, type: 'POLICY_CHANGE', approverRole: 'OWNER', payload: { change: 'New policy' } });
    expect(res.status).toBe(201);
  });

  it('lists approvals for deputy/owner', async () => {
    const owner = await createOwner();
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app).get('/api/v1/approvals').set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createRestaurant, signToken, authHeader } from './helpers.js';

describe('👥 Staff Enrollment Endpoints', () => {
  it('enrolls a staff member', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    const res = await request(app)
      .post(`/api/v1/restaurants/${rest._id}/staff`)
      .set(authHeader(token))
      .send({ firstName: 'Staff', lastName: 'One', role: 'WAITER' });
    expect(res.status).toBe(201);
    expect(res.body.data.user.staffId).toBeDefined();
  });

  it('lists enrolled staff', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const token = await signToken(owner._id.toString(), 'OWNER');
    await request(app).post(`/api/v1/restaurants/${rest._id}/staff`).set(authHeader(token))
      .send({ firstName: 'Staff', lastName: 'Two', role: 'WAITER' });
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/staff`).set(authHeader(token));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects access for non-HR/owner', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const res = await request(app).get(`/api/v1/restaurants/${rest._id}/staff`);
    expect(res.status).toBe(401);
  });
});

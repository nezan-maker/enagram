import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import { signToken, createUser, createRestaurant, createOwner, createClient, authHeader } from './helpers.js';

describe('🔌 Smoke Test — Server boots & DB connects', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/ping returns 200', async () => {
    const res = await request(app).get('/api/v1/ping');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/enagram api/i);
  });

  it('DB is connected with in-memory MongoDB', async () => {
    expect(mongoose.connection.readyState).toBe(1); // connected
  });
});

describe('🏪 Helpers work correctly', () => {
  it('createUser creates a user in the DB', async () => {
    const user = await createUser({ email: 'smoke@test.com' });
    expect(user._id).toBeDefined();
    expect(user.email).toBe('smoke@test.com');
    expect(user.role).toBe('CLIENT');
  });

  it('signToken produces a valid JWT', async () => {
    const user = await createClient();
    const token = await signToken(user._id.toString(), user.role);
    expect(token.split('.')).toHaveLength(3); // valid JWT structure
  });

  it('createRestaurant creates a restaurant', async () => {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    expect(rest.slug).toBeDefined();
    expect(rest.ownerId.toString()).toBe(owner._id.toString());
  });

  it('authHeader returns Authorization object', () => {
    const h = authHeader('token123');
    expect(h.Authorization).toBe('Bearer token123');
  });
});

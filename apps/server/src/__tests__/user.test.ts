import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { mongoose } from 'mongoose';
import { User } from '../models/User.model.js';
import { env } from '../config/env.js';
import { authHeader, signToken, createClient, createOwner, createRestaurant } from './helpers.js';

describe('👤 User Endpoints', () => {
  // Debug: log env state
  beforeAll(() => {
    console.log('[DEBUG] env.JWT_ACCESS_SECRET starts with:', env.JWT_ACCESS_SECRET.substring(0, 8));
    console.log('[DEBUG] mongoose.connection.readyState:', mongoose.connection.readyState);
    console.log('[DEBUG] MONGO_URI:', process.env.MONGO_URI?.substring(0, 40));
  });

  describe('GET /api/v1/users/me', () => {
    it('returns authenticated user profile', async () => {
      const user = await createClient();
      console.log('[DEBUG] User created:', user._id.toString(), 'role:', user.role);
      
      const token = await signToken(user._id.toString(), user.role);
      console.log('[DEBUG] Token valid?', token.split('.').length === 3);

      // Verify user exists in DB
      const found = await User.findById(user._id);
      console.log('[DEBUG] DB lookup by ObjectId:', found ? 'FOUND' : 'NOT FOUND');
      const foundStr = await User.findById(user._id.toString());
      console.log('[DEBUG] DB lookup by string:', foundStr ? 'FOUND' : 'NOT FOUND');
      
      const res = await request(app)
        .get('/api/v1/users/me')
        .set(authHeader(token));

      console.log('[DEBUG] Response status:', res.status);
      console.log('[DEBUG] Response body:', JSON.stringify(res.body).substring(0, 300));
      
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(user.email);
      expect(res.body.data.password).toBeUndefined();
      expect(res.body.data.refreshToken).toBeUndefined();
    });

    it('rejects unauthenticated', async () => {
      const res = await request(app).get('/api/v1/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('updates own profile', async () => {
      const user = await createClient();
      const token = await signToken(user._id.toString(), user.role);

      const res = await request(app)
        .patch('/api/v1/users/me')
        .set(authHeader(token))
        .send({ firstName: 'Updated', lastName: 'Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.firstName).toBe('Updated');
      expect(res.body.data.lastName).toBe('Name');
    });

    it('updates phone number', async () => {
      const user = await createClient();
      const token = await signToken(user._id.toString(), user.role);

      const res = await request(app)
        .patch('/api/v1/users/me')
        .set(authHeader(token))
        .send({ phone: '+250******000' });

      expect(res.status).toBe(200);
      expect(res.body.data.phone).toBe('+250******000');
    });
  });

  describe('GET /api/v1/users/me/orders', () => {
    it('returns empty list for user with no orders', async () => {
      const user = await createClient();
      const token = await signToken(user._id.toString(), user.role);

      const res = await request(app)
        .get('/api/v1/users/me/orders')
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('POST /api/v1/users/me/addresses', () => {
    it('adds an address to user profile', async () => {
      const user = await createClient();
      const token = await signToken(user._id.toString(), user.role);

      const res = await request(app)
        .post('/api/v1/users/me/addresses')
        .set(authHeader(token))
        .send({ label: 'Home', street: '123 Main St', city: 'Kigali' });

      expect(res.status).toBe(200);
      expect(res.body.data.savedAddresses).toHaveLength(1);
      expect(res.body.data.savedAddresses[0].label).toBe('Home');
    });
  });

  describe('POST /api/v1/users/me/favourites/:restaurantId', () => {
    it('toggles favourite restaurant', async () => {
      const owner = await createOwner();
      const restaurant = await createRestaurant(owner._id);
      const user = await createClient();
      const token = await signToken(user._id.toString(), user.role);

      // Toggle on
      const res1 = await request(app)
        .post(`/api/v1/users/me/favourites/${restaurant._id}`)
        .set(authHeader(token));

      expect(res1.status).toBe(200);

      // Toggle off
      const res2 = await request(app)
        .post(`/api/v1/users/me/favourites/${restaurant._id}`)
        .set(authHeader(token));

      expect(res2.status).toBe(200);
    });
  });
});

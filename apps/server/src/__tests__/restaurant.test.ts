import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createClient, createRestaurant, signToken, authHeader } from './helpers.js';

describe('🏪 Restaurant Endpoints', () => {
  describe('GET /api/v1/restaurants (public)', () => {
    it('lists restaurants (empty initially)', async () => {
      const res = await request(app).get('/api/v1/restaurants');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('shows created restaurant in list', async () => {
      const owner = await createOwner();
      await createRestaurant(owner._id);

      const res = await request(app).get('/api/v1/restaurants');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/v1/restaurants/:id', () => {
    it('gets a single restaurant', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);

      const res = await request(app).get(`/api/v1/restaurants/${rest._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(rest.name);
    });

    it('returns 404 for non-existent', async () => {
      const res = await request(app).get('/api/v1/restaurants/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/restaurants (owner only)', () => {
    it('creates a new restaurant', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);

      const res = await request(app)
        .post('/api/v1/restaurants')
        .set(authHeader(token))
        .send({
          name: 'My New Restaurant',
          address: { street: '456 Oak Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
          contact: { phone: '+250******111' },
          cuisineType: ['African'],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('My New Restaurant');
    });

    it('rejects non-owner', async () => {
      const client = await createClient();
      const token = await signToken(client._id.toString(), client.role);

      const res = await request(app)
        .post('/api/v1/restaurants')
        .set(authHeader(token))
        .send({
          name: 'Unauthorized',
          address: { street: '123 St', city: 'City', province: 'Province', country: 'Country' },
          contact: { phone: '+250******222' },
        });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/restaurants/:id', () => {
    it('updates restaurant details', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);
      const rest = await createRestaurant(owner._id);

      const res = await request(app)
        .patch(`/api/v1/restaurants/${rest._id}`)
        .set(authHeader(token))
        .send({ description: 'Updated description' });

      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe('Updated description');
    });
  });

  describe('PATCH /api/v1/restaurants/:id/hours', () => {
    it('updates opening hours', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);
      const rest = await createRestaurant(owner._id);

      const hours = [
        { day: 'MON', open: '08:00', close: '22:00', isClosed: false },
        { day: 'TUE', open: '08:00', close: '22:00', isClosed: false },
      ];

      const res = await request(app)
        .patch(`/api/v1/restaurants/${rest._id}/hours`)
        .set(authHeader(token))
        .send({ openingHours: hours });

      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/v1/restaurants/:id/toggle', () => {
    it('toggles restaurant open/closed', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);
      const rest = await createRestaurant(owner._id);

      const res = await request(app)
        .patch(`/api/v1/restaurants/${rest._id}/toggle`)
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.isOpen).toBe(true);
    });
  });

  describe('GET /api/v1/restaurants/:id/staff', () => {
    it('lists staff for restaurant', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);
      const rest = await createRestaurant(owner._id);

      const res = await request(app)
        .get(`/api/v1/restaurants/${rest._id}/staff`)
        .set(authHeader(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/v1/restaurants/:id', () => {
    it('deletes own restaurant', async () => {
      const owner = await createOwner();
      const token = await signToken(owner._id.toString(), owner.role);
      const rest = await createRestaurant(owner._id);

      const res = await request(app)
        .delete(`/api/v1/restaurants/${rest._id}`)
        .set(authHeader(token));

      expect(res.status).toBe(200);
    });

    it('rejects non-owner deletion', async () => {
      const owner = await createOwner();
      const client = await createClient();
      const token = await signToken(client._id.toString(), client.role);
      const rest = await createRestaurant(owner._id);

      const res = await request(app)
        .delete(`/api/v1/restaurants/${rest._id}`)
        .set(authHeader(token));

      expect(res.status).toBe(403);
    });
  });
});

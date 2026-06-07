import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { Menu } from '../models/Menu.model.js';
import { createOwner, createKitchenManager, createRestaurant, signToken, authHeader } from './helpers.js';

describe('📋 Menu Endpoints', () => {
  describe('GET / (public list)', () => {
    it('lists menus (can be empty)', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const res = await request(app).get(`/api/v1/restaurants/${rest._id}/menus`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST / (create menu)', () => {
    it('creates a menu', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const token = await signToken(owner._id.toString(), owner.role);

      const res = await request(app)
        .post(`/api/v1/restaurants/${rest._id}/menus`)
        .set(authHeader(token))
        .send({ name: 'Lunch Menu' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Lunch Menu');
    });
  });

  describe('PATCH /:menuId (update menu)', () => {
    it('updates menu name as kitchen manager', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const km = await createKitchenManager(rest._id);
      const token = await signToken(km._id.toString(), km.role);
      const menu = await Menu.create({ restaurantId: rest._id, name: 'Old Name', createdBy: owner._id });

      const res = await request(app)
        .patch(`/api/v1/restaurants/${rest._id}/menus/${menu._id}`)
        .set(authHeader(token))
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('New Name');
    });
  });

  describe('POST /:menuId/items (add menu item)', () => {
    it('adds an item to a menu', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const token = await signToken(owner._id.toString(), owner.role);
      const menu = await Menu.create({ restaurantId: rest._id, name: 'Menu', createdBy: owner._id });

      const res = await request(app)
        .post(`/api/v1/restaurants/${rest._id}/menus/${menu._id}/items`)
        .set(authHeader(token))
        .send({ name: 'Burger', price: 12.99, category: 'MAIN' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Burger');
    });

    it('creates pending approval when chef suggests', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const chef = await createKitchenManager(rest._id);
      const chefToken = await signToken(chef._id.toString(), 'CHEF');
      const menu = await Menu.create({ restaurantId: rest._id, name: 'Menu', createdBy: owner._id });

      const res = await request(app)
        .post(`/api/v1/restaurants/${rest._id}/menus/${menu._id}/items`)
        .set(authHeader(chefToken))
        .send({ name: 'Chef Special', price: 15.99, category: 'MAIN' });

      expect(res.status).toBe(201);
      expect(res.body.data.approvalStatus).toBe('PENDING');
    });
  });

  describe('POST /:menuId/items/:itemId/approve', () => {
    it('approves a pending menu item', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const km = await createKitchenManager(rest._id);
      const menu = await Menu.create({ restaurantId: rest._id, name: 'Menu', createdBy: owner._id });

      const chefToken = await signToken(km._id.toString(), 'CHEF');
      const add = await request(app)
        .post(`/api/v1/restaurants/${rest._id}/menus/${menu._id}/items`)
        .set(authHeader(chefToken))
        .send({ name: 'Special', price: 14.99, category: 'MAIN' });

      const itemId = add.body.data._id;

      const kmToken = await signToken(km._id.toString(), 'KITCHEN_MANAGER');
      const res = await request(app)
        .patch(`/api/v1/restaurants/${rest._id}/menus/${menu._id}/items/${itemId}/approve`)
        .set(authHeader(kmToken));

      expect(res.status).toBe(200);
      expect(res.body.data.approvalStatus).toBe('APPROVED');
    });
  });

  describe('DELETE /:menuId', () => {
    it('deletes a menu as kitchen manager', async () => {
      const owner = await createOwner();
      const rest = await createRestaurant(owner._id);
      const km = await createKitchenManager(rest._id);
      const token = await signToken(km._id.toString(), km.role);
      const menu = await Menu.create({ restaurantId: rest._id, name: 'Delete Me', createdBy: owner._id });

      const res = await request(app)
        .delete(`/api/v1/restaurants/${rest._id}/menus/${menu._id}`)
        .set(authHeader(token));

      expect(res.status).toBe(200);
    });
  });
});

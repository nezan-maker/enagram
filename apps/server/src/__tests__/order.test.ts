import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { createOwner, createClient, createRestaurant, signToken, authHeader } from './helpers.js';
import { Menu } from '../models/Menu.model.js';
import { MenuItem } from '../models/MenuItem.model.js';

describe('📦 Order Endpoints', () => {
  async function seedData() {
    const owner = await createOwner();
    const rest = await createRestaurant(owner._id);
    const menu = await Menu.create({ restaurantId: rest._id, name: 'Menu', createdBy: owner._id });
    const item = await MenuItem.create({ menuId: menu._id, restaurantId: rest._id, name: 'Burger', price: 12.99, category: 'MAIN' });
    return { owner, rest, menu, item };
  }

  it('creates an order', async () => {
    const { rest, item } = await seedData();
    const client = await createClient();
    const token = await signToken(client._id.toString(), client.role);
    const res = await request(app)
      .post('/api/v1/orders')
      .set(authHeader(token))
      .send({
        restaurantId: rest._id,
        type: 'DINE_IN',
        items: [{ menuItemId: item._id, name: 'Burger', price: 12.99, quantity: 2 }],
        subtotal: 25.98, tax: 3.12, total: 29.10,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.items).toHaveLength(1);
  });

  it('gets order by ID', async () => {
    const { rest, item } = await seedData();
    const client = await createClient();
    const token = await signToken(client._id.toString(), client.role);
    const create = await request(app).post('/api/v1/orders').set(authHeader(token))
      .send({ restaurantId: rest._id, type: 'DINE_IN',
        items: [{ menuItemId: item._id, name: 'Burger', price: 12.99, quantity: 1 }],
        subtotal: 12.99, tax: 1.56, total: 14.55 });
    const res = await request(app).get(`/api/v1/orders/${create.body.data._id}`).set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('updates order status', async () => {
    const { rest, item } = await seedData();
    const client = await createClient();
    const token = await signToken(client._id.toString(), client.role);
    const create = await request(app).post('/api/v1/orders').set(authHeader(token))
      .send({ restaurantId: rest._id, type: 'DINE_IN',
        items: [{ menuItemId: item._id, name: 'Burger', price: 12.99, quantity: 1 }],
        subtotal: 12.99, tax: 1.56, total: 14.55 });
    const ownerToken = await signToken(rest.ownerId.toString(), 'OWNER');
    const res = await request(app).patch(`/api/v1/orders/${create.body.data._id}/status`).set(authHeader(ownerToken))
      .send({ status: 'CONFIRMED' });
    expect(res.status).toBe(200);
  });

  it('cancels order', async () => {
    const { rest, item } = await seedData();
    const client = await createClient();
    const token = await signToken(client._id.toString(), client.role);
    const create = await request(app).post('/api/v1/orders').set(authHeader(token))
      .send({ restaurantId: rest._id, type: 'DINE_IN',
        items: [{ menuItemId: item._id, name: 'Burger', price: 12.99, quantity: 1 }],
        subtotal: 12.99, tax: 1.56, total: 14.55 });
    const res = await request(app).delete(`/api/v1/orders/${create.body.data._id}`).set(authHeader(token));
    expect(res.status).toBe(200);
  });

  it('marks order as paid', async () => {
    const { rest, item } = await seedData();
    const client = await createClient();
    const token = await signToken(client._id.toString(), client.role);
    const create = await request(app).post('/api/v1/orders').set(authHeader(token))
      .send({ restaurantId: rest._id, type: 'DINE_IN',
        items: [{ menuItemId: item._id, name: 'Burger', price: 12.99, quantity: 1 }],
        subtotal: 12.99, tax: 1.56, total: 14.55 });
    const res = await request(app).patch(`/api/v1/orders/${create.body.data._id}/pay`).set(authHeader(token));
    expect(res.status).toBe(200);
  });
});

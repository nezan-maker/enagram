import { SignJWT } from 'jose';
import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import { Restaurant } from '../models/Restaurant.model.js';
import { env } from '../config/env.js';

// ── Token generation ─────────────────────────────────────
const encoder = new TextEncoder();

export async function signToken(userId: string, role: string): Promise<string> {
  const secret = encoder.encode(env.JWT_ACCESS_SECRET);
  return new SignJWT({ _id: userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);
}

// ── User factories ───────────────────────────────────────
export async function createUser(overrides: Partial<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  restaurantId: mongoose.Types.ObjectId;
  isActive: boolean;
  staffId: string;
}> = {}) {
  return User.create({
    email: `test-${Date.now()}@test.com`,
    password: '$2a$12$LJ3m4ys3Lk2kYS2kY2kY2kY2kY2kY2kY2kY2kY2kY2kY2kY2kY', // bcrypt 12 rounds hash placeholder
    firstName: 'Test',
    lastName: 'User',
    role: 'CLIENT',
    isActive: true,
    isPasswordSet: true,
    ...overrides,
  });
}

export async function createOwner(overrides = {}) {
  return createUser({ role: 'OWNER', email: `owner-${Date.now()}@test.com`, ...overrides });
}

export async function createWaiter(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'WAITER',
    email: `waiter-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createChef(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'CHEF',
    email: `chef-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createKitchenManager(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'KITCHEN_MANAGER',
    email: `km-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createDeputyManager(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'DEPUTY_MANAGER',
    email: `dm-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createHRManager(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'HR_MANAGER',
    email: `hr-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createFinanceManager(restaurantId: mongoose.Types.ObjectId, overrides = {}) {
  return createUser({
    role: 'FINANCE_MANAGER',
    email: `fin-${Date.now()}@test.com`,
    restaurantId,
    ...overrides,
  });
}

export async function createClient(overrides = {}) {
  return createUser({ role: 'CLIENT', email: `client-${Date.now()}@test.com`, ...overrides });
}

// ── Restaurant factory ───────────────────────────────────
export async function createRestaurant(ownerId: mongoose.Types.ObjectId, overrides: Partial<{
  name: string;
  slug: string;
  isOpen: boolean;
}> = {}) {
  const seq = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  return Restaurant.create({
    ownerId,
    name: `Test Restaurant ${seq}`,
    slug: `test-restaurant-${seq}`,
    description: 'A test restaurant',
    address: {
      street: '123 Test St',
      city: 'Test City',
      province: 'Test Province',
      country: 'Test Country',
    },
    contact: { phone: '+1234567890' },
    isOpen: false,
    ...overrides,
  });
}

// ── Auth header helper ───────────────────────────────────
export function authHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

// ── Password helper ──────────────────────────────────────
import bcrypt from 'bcryptjs';

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 4); // light rounds for test speed
}

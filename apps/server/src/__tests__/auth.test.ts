import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { User } from '../models/User.model.js';

describe('🔐 Auth Endpoints', () => {
  // ── POST /api/v1/auth/register ────────────────────────
  describe('POST /api/v1/auth/register', () => {
    it('registers a new CLIENT user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'password123!', firstName: 'New', lastName: 'User', role: 'CLIENT' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('new@test.com');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('registers an OWNER user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'owner-new@test.com', password: 'password123!', firstName: 'Owner', lastName: 'User', role: 'OWNER' });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('OWNER');
    });

    it('rejects duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'dup@test.com', password: 'password123!', firstName: 'Dup', lastName: 'User', role: 'CLIENT' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'dup@test.com', password: 'password123!', firstName: 'Dup', lastName: 'User', role: 'CLIENT' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects invalid role', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'bad@test.com', password: 'password123!', firstName: 'Bad', lastName: 'User', role: 'INVALID' });

      expect(res.status).toBe(400);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'short@test.com', password: '123', firstName: 'Short', lastName: 'User', role: 'CLIENT' });

      expect(res.status).toBe(400);
    });

    it('rejects missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'miss@test.com' });

      expect(res.status).toBe(400);
    });
  });

  // ── POST /api/v1/auth/login ───────────────────────────
  describe('POST /api/v1/auth/login', () => {
    it('logs in with valid credentials', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'login@test.com', password: 'password123!', firstName: 'Login', lastName: 'User', role: 'CLIENT' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'password123!' });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('rejects wrong password', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'wrongpw@test.com', password: 'password123!', firstName: 'Wrong', lastName: 'PW', role: 'CLIENT' });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'wrongpw@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('rejects non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'password123!' });

      expect(res.status).toBe(401);
    });
  });

  // ── POST /api/v1/auth/refresh ─────────────────────────
  describe('POST /api/v1/auth/refresh', () => {
    it('returns new tokens with valid refresh token', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'refresh@test.com', password: 'password123!', firstName: 'Ref', lastName: 'Resh', role: 'CLIENT' });

      const refreshToken = reg.body.data.refreshToken;

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      // Token should be valid JWT (3 parts)
      expect(res.body.data.refreshToken.split('.')).toHaveLength(3);
    });

    it('rejects invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(res.status).toBe(401);
    });
  });

  // ── GET /api/v1/auth/me ────────────────────────────────
  describe('GET /api/v1/auth/me', () => {
    it('returns current user profile', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'me@test.com', password: 'password123!', firstName: 'Me', lastName: 'User', role: 'CLIENT' });

      const token = reg.body.data.accessToken;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('me@test.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('rejects unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });

  // ── POST /api/v1/auth/logout ──────────────────────────
  describe('POST /api/v1/auth/logout', () => {
    it('clears refresh token on logout', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'logout@test.com', password: 'password123!', firstName: 'Log', lastName: 'Out', role: 'CLIENT' });

      const token = reg.body.data.accessToken;
      const userId = reg.body.data.user._id;

      // Verify token exists before logout
      const userBefore = await User.findById(userId);
      expect(userBefore!.refreshToken).toBeDefined();

      // Logout
      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);

      // Verify token was cleared in DB
      const userAfter = await User.findById(userId);
      expect(userAfter!.refreshToken).toBeUndefined();
    });

    it('rejects logout without auth', async () => {
      const res = await request(app).post('/api/v1/auth/logout');
      expect(res.status).toBe(401);
    });
  });

  // ── POST /api/v1/auth/staff/login ──────────────────────
  describe('POST /api/v1/auth/staff/login', () => {
    it('allows staff first-login to set password', async () => {
      const user = await User.create({
        email: `staff-first@test.com`,
        staffId: 'STAFF001',
        role: 'WAITER',
        firstName: 'Staff',
        lastName: 'One',
        isActive: true,
        isPasswordSet: false,
      });

      const res = await request(app)
        .post('/api/v1/auth/staff/login')
        .send({ staffId: 'STAFF001', password: 'newpassword123!' });

      expect(res.status).toBe(200);
      expect(res.body.data.firstLogin).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();

      const updated = await User.findById(user._id);
      expect(updated!.isPasswordSet).toBe(true);
    });

    it('rejects invalid staff ID', async () => {
      const res = await request(app)
        .post('/api/v1/auth/staff/login')
        .send({ staffId: 'NONEXIST', password: 'password123!' });

      expect(res.status).toBe(401);
    });

    it('rejects deactivated staff', async () => {
      await User.create({
        email: `deact-staff@test.com`,
        staffId: 'STAFF002',
        role: 'WAITER',
        firstName: 'Deact',
        lastName: 'Staff',
        isActive: false,
        isPasswordSet: true,
      });

      const res = await request(app)
        .post('/api/v1/auth/staff/login')
        .send({ staffId: 'STAFF002', password: 'password123!' });

      expect(res.status).toBe(403);
    });
  });
});

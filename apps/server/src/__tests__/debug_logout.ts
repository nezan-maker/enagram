import { app } from '../app.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../models/User.model.js';

// Quick debug script
async function main() {
  // This assumes MONGO_URI is already set in env
  // Run with: MONGO_URI=mongodb://localhost:27017/enagram_test npx tsx src/__tests__/debug_logout.ts
  await mongoose.connect('mongodb://localhost:27017/enagram_test_debug');

  const reg = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'debug-logout@test.com', password: 'password123!', firstName: 'Debug', lastName: 'User', role: 'CLIENT' });

  console.log('REGISTER status:', reg.status);
  const token = reg.body.data.accessToken;
  const userId = reg.body.data.user._id;
  console.log('User ID:', userId);

  const before = await User.findById(userId);
  console.log('BEFORE - refreshToken:', before?.refreshToken ? 'EXISTS' : 'UNDEFINED');

  const logout = await request(app)
    .post('/api/v1/auth/logout')
    .set('Authorization', 'Bearer ' + token);

  console.log('LOGOUT status:', logout.status);
  console.log('LOGOUT body:', JSON.stringify(logout.body));

  const after = await User.findById(userId);
  console.log('AFTER - refreshToken:', after?.refreshToken ? 'STILL EXISTS' : 'UNDEFINED');

  // Also test findByIdAndUpdate directly
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
  const afterDirect = await User.findById(userId);
  console.log('AFTER $unset update - refreshToken:', afterDirect?.refreshToken ? 'STILL EXISTS' : 'UNDEFINED');

  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
}

main().catch(console.error);

import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';

// Connect once before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

// Clear all collections between tests for isolation
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Drop test DB and disconnect
afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

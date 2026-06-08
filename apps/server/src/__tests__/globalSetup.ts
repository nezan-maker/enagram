export async function setup() {
  const dbName = `enagram_test_${Date.now()}`;
  
  process.env.MONGO_URI = `mongodb://localhost:27017/${dbName}?retryWrites=false`;
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-that-is-32-bytes!!';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-32-bytes';
  process.env.JWT_ACCESS_EXPIRY = '15m';
  process.env.JWT_REFRESH_EXPIRY = '7d';
  process.env.CLIENT_URL = 'http://localhost:5173';
  
  (globalThis as any).__TEST_DB_NAME__ = dbName;
}

export async function teardown() {
  // Cleanup happens in setup.ts afterAll
}

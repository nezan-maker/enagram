import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

// Login
const loginResult = execSync(
  'curl -s -X POST http://localhost:4000/api/v1/auth/login -H "Content-Type: application/json" -d \'{"email":"owner@enagram.io","password":"ownerpass123"}\''
).toString();

const loginData = JSON.parse(loginResult);
const token = loginData.data.accessToken;
writeFileSync('/tmp/otoken.txt', token);

// Test staff enrollment
const staffResult = execSync(
  `curl -s -X POST http://localhost:4000/api/v1/restaurants/6a246c77b9de138d51046a81/staff -H "Content-Type: application/json" -H "Authorization: Bearer ${token}" -d '{"firstName":"Jane","lastName":"HR","phone":"+155****0001","role":"HR_MANAGER"}'`
).toString();

console.log('Staff enrollment result:', staffResult.substring(0, 300));

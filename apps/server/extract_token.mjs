import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const result = execSync(
  'curl -s -X POST http://localhost:4000/api/v1/auth/login -H "Content-Type: application/json" -d \'{"email":"owner@enagram.io","password":"ownerpass123"}\''
).toString();

const data = JSON.parse(result);
const token = data.data.accessToken;
writeFileSync('/tmp/otoken.txt', token);
console.log('Token length:', token.length);
console.log('Token prefix:', token.substring(0, 30));

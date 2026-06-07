const jwt = require('jsonwebtoken');
const { spawnSync } = require('child_process');
const fs = require('fs');

const BASE = 'http://localhost:4000/api/v1';

// Read secret from .env
const envContent = fs.readFileSync('.env','utf8');
const envVars = {};
envContent.split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{
  const [k,...v] = l.split('=');
  envVars[k.trim()] = v.join('=').trim();
});
const secret = envVars.JWT_REFRESH_SECRET;

const now = Date.now();

function api(method, path, body) {
  const args = ['-s', '-X', method, BASE+path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  const proc = spawnSync('curl', args, {encoding:'utf8',timeout:10000});
  return JSON.parse(proc.stdout);
}

// 1. Register
const r1 = api('POST', '/auth/register', {email:'rf-'+now+'@t.io',password:'test1234',firstName:'T',lastName:'T',role:'OWNER'});
const rt = r1.data.refreshToken;
const uid = r1.data.user._id;
console.log('=== REGISTER ===');
console.log('refreshToken from server:', rt.substring(0, 20)+'...');
console.log('refreshToken len:', rt.length);

// 2. Locally verify the token
try {
  const decoded = jwt.verify(rt, secret);
  console.log('Local verify of server token: OK, _id:', decoded._id);
  console.log('Expected _id:', uid);
  console.log('Match:', decoded._id === uid);
} catch(e) {
  console.log('Local verify FAILED:', e.message);
}

// 3. Now try the same token via refresh endpoint
const r2 = api('POST', '/auth/refresh', {refreshToken: rt});
console.log('\n=== REFRESH ENDPOINT ===');
console.log('Status:', r2.statusCode);
console.log('Message:', r2.message);

// 4. If that failed, fetch user from server to compare stored token
// We can't do this without auth, so let's login and try again
const r3 = api('POST', '/auth/login', {email:r1.data.user.email,password:'test1234'});
const rt3 = r3.data.refreshToken;
console.log('\n=== LOGIN ===');
console.log('New refreshToken len:', rt3.length);

// 5. Locally verify the login's token
try {
  const decoded3 = jwt.verify(rt3, secret);
  console.log('Local verify of login token: OK, _id:', decoded3._id);
} catch(e) {
  console.log('Local verify of login token FAILED:', e.message);
}

// 6. Try refresh endpoint with login's token
const r4 = api('POST', '/auth/refresh', {refreshToken: rt3});
console.log('\n=== REFRESH WITH LOGIN TOKEN ===');
console.log('Status:', r4.statusCode);
console.log('Message:', r4.message);

// 7. If register token != login token locally, compare them
console.log('\n=== COMPARISON ===');
console.log('Register token === Login token:', rt === rt3);
console.log('Register token first 30:', rt.substring(0, 30));
console.log('Login token first 30:   ', rt3.substring(0, 30));

const { spawnSync } = require('child_process');
const BASE = 'http://localhost:4000/api/v1';
function curl(method, path, body) {
  const args = ['-s', '-X', method, BASE+path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  const proc = spawnSync('curl', args, {encoding:'utf8',timeout:10000});
  const parsed = JSON.parse(proc.stdout);
  console.log(method, path, '->', parsed.statusCode, parsed.message?.substring(0, 50) || '');
  return parsed;
}
const now = Date.now();

// Register + extract tokens raw
const r1 = curl('POST', '/auth/register', {email:'rf2-'+now+'@t.io',password:'test1234',firstName:'T',lastName:'T',role:'OWNER'});
const at1 = r1.data.accessToken;
const rt1 = r1.data.refreshToken;
console.log('ACCESS token len:', at1 ? at1.length : 'MISSING');
console.log('REFRESH token len:', rt1 ? rt1.length : 'MISSING');

// Try refresh right away WITH register's refresh token
const r2 = curl('POST', '/auth/refresh', {refreshToken: rt1});
console.log('Refresh attempt 1 (register rt):', r2.message);

// Now login and try with login's refresh token
const r3 = curl('POST', '/auth/login', {email:r1.data.user.email,password:'test1234'});
const rt3 = r3.data.refreshToken;
console.log('LOGIN refresh token len:', rt3 ? rt3.length : 'MISSING');

const r4 = curl('POST', '/auth/refresh', {refreshToken: rt3});
console.log('Refresh attempt 2 (login rt):', r4.message);

// If still failing, try using the access token as refresh (should fail with wrong signature)
const r5 = curl('POST', '/auth/refresh', {refreshToken: at1});
console.log('Refresh attempt 3 (access token as refresh):', r5.message);

const { spawnSync } = require('child_process');
const BASE = 'http://localhost:4000/api/v1';
function curl(method, path, body) {
  const args = ['-s', '-X', method, BASE+path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  return JSON.parse(spawnSync('curl', args, {encoding:'utf8',timeout:10000}).stdout);
}
const now = Date.now();

// 1. Register
const r1 = curl('POST', '/auth/register', {email:'rf-'+now+'@t.io',password:'test1234',firstName:'T',lastName:'T',role:'OWNER'});
console.log('REG:', r1.statusCode, r1.success);
console.log('REG refreshToken present:', !!r1.data.refreshToken);
console.log('REG refreshToken len:', r1.data.refreshToken.length);

// 2. Login
const r2 = curl('POST', '/auth/login', {email:r1.data.user.email,password:'test1234'});
console.log('LOGIN:', r2.statusCode, r2.success);
console.log('LOGIN refreshToken present:', !!r2.data.refreshToken);
console.log('LOGIN refreshToken len:', r2.data.refreshToken.length);

// 3. Refresh
const r3 = curl('POST', '/auth/refresh', {refreshToken: r2.data.refreshToken});
console.log('REFRESH:', r3.statusCode, r3.success, r3.message);

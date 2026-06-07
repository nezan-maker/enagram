const jwt = require('jsonwebtoken');
const fs = require('fs');
const envContent = fs.readFileSync('.env','utf8');
const envVars = {};
envContent.split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{
  const [k,...v] = l.split('=');
  envVars[k.trim()] = v.join('=').trim();
});
console.log('REFRESH_SECRET found:', !!envVars.JWT_REFRESH_SECRET);
const secret = envVars.JWT_REFRESH_SECRET || '';
const token = jwt.sign({_id:'test123'}, secret, {expiresIn:'7d'});
console.log('Token len:', token.length);
try {
  const decoded = jwt.verify(token, secret);
  console.log('VERIFY OK:', decoded._id);
} catch(e) {
  console.log('VERIFY FAIL:', e.message);
}
// Now test with wrong secret
try {
  jwt.verify(token, 'wrong-secret');
} catch(e) {
  console.log('WRONG SECRET fails as expected:', e.message);
}

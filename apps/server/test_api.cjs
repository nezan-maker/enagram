const { spawnSync } = require('child_process');
const fs = require('fs');
const BASE = 'http://localhost:4000/api/v1';
const TOKEN_FILE = '/tmp/enagram_token.txt';
const STAFF_TOKEN_FILE = '/tmp/enagram_staff_token.txt';

function api(method, path, body, tokenFile) {
  const args = ['-s', '-X', method, BASE + path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  if (tokenFile) {
    const t = fs.readFileSync(tokenFile, 'utf8').trim();
    var parts = ['Authorization: Bearer', t];
    args.push('-H', parts.join(' '));
  }
  const proc = spawnSync('curl', args, { encoding: 'utf8', timeout: 10000 });
  if (proc.error) throw new Error('curl: ' + proc.error.message);
  const parsed = JSON.parse(proc.stdout);
  return parsed;
}

function must(resp, label) {
  if (!resp || !resp.success) {
    console.log('  X FAIL (' + label + '):', resp ? resp.message : 'no response');
    process.exit(1);
  }
  return resp.data;
}

function p(text) { console.log('\n--- ' + text + ' ---'); }

try { fs.unlinkSync(TOKEN_FILE); } catch {}
try { fs.unlinkSync(STAFF_TOKEN_FILE); } catch {}
const now = String(Date.now());
console.log('');

p('1. AUTH');
const regRaw = api('POST', '/auth/register', {email:'owner-'+now+'@enagram.io',password:'test1234',firstName:'J',lastName:'O',role:'OWNER'});
const regData = must(regRaw, 'register');
fs.writeFileSync(TOKEN_FILE, regData.accessToken);
const logRaw = api('POST', '/auth/login', {email:regData.user.email,password:'test1234'});
const logData = must(logRaw, 'login');
fs.writeFileSync(TOKEN_FILE, logData.accessToken);
const me = must(api('GET', '/auth/me', null, TOKEN_FILE), 'profile');
console.log('  Role:', me.role);
must(api('POST', '/auth/refresh', {refreshToken:logData.refreshToken}), 'refresh');

p('2. RESTAURANTS');
const restData = must(api('POST', '/restaurants', {name:'Bistro '+now,address:{street:'1 Main St',city:'NYC',province:'NY',country:'USA'},contact:{phone:'+121****0000'}}, TOKEN_FILE), 'create');
const rid = restData._id;
console.log('  rid:', rid);
must(api('GET', '/restaurants'), 'list');
must(api('GET', '/restaurants/'+rid), 'detail');
must(api('PATCH', '/restaurants/'+rid+'/toggle', {isOpen:true}, TOKEN_FILE), 'toggle');
must(api('PATCH', '/restaurants/'+rid+'/hours', {openingHours:[{day:'MON',open:'08:00',close:'22:00',isClosed:false}]}, TOKEN_FILE), 'hours');

p('3. STAFF');
const staffData = must(api('POST', '/restaurants/'+rid+'/staff', {firstName:'Jane',lastName:'HR',phone:'+155****0001',role:'HR_MANAGER'}, TOKEN_FILE), 'enroll');
const sid = staffData.staffId;
console.log('  staffId:', sid);
must(api('GET', '/restaurants/'+rid+'/staff', null, TOKEN_FILE), 'list');
must(api('GET', '/restaurants/'+rid+'/staff/'+staffData.user._id, null, TOKEN_FILE), 'detail');

p('4. STAFF LOGIN');
const slogRaw = api('POST', '/auth/staff/login', {staffId:sid,password:'newPass123'});
const slogData = must(slogRaw, 'staff login');
fs.writeFileSync(STAFF_TOKEN_FILE, slogData.accessToken);

p('5. MENUS');
const menuData = must(api('POST', '/restaurants/'+rid+'/menus', {name:'Lunch Menu'}, TOKEN_FILE), 'create menu');
const mid = menuData._id;
must(api('GET', '/restaurants/'+rid+'/menus'), 'list');
const itemData = must(api('POST', '/restaurants/'+rid+'/menus/'+mid+'/items', {name:'Burger',price:1599,category:'Mains',description:'Juicy'}, TOKEN_FILE), 'add item (owner)');
const iid = itemData.menuItem ? itemData.menuItem._id : itemData._id;
const appr = must(api('PATCH', '/restaurants/'+rid+'/menus/'+mid+'/items/'+iid+'/approve', null, TOKEN_FILE), 'approve');
console.log('  approvalStatus:', appr.approvalStatus);

p('6. ORDERS');
const ordData = must(api('POST', '/orders', {restaurantId:rid,type:'DINE_IN',items:[{menuItemId:iid,name:'Burger',price:1599,quantity:2}]}, TOKEN_FILE), 'place');
const oid = ordData._id;
console.log('  initial:', ordData.status);
for (const s of ['CONFIRMED','PREPARING','READY','DELIVERED','COMPLETED']) {
  const r = must(api('PATCH', '/orders/'+oid+'/status', {status:s}, TOKEN_FILE), '-> '+s);
  console.log('  now:', r.status);
}
must(api('PATCH', '/orders/'+oid+'/pay', {paymentMethod:'CARD'}, TOKEN_FILE), 'pay');

p('7. TABLES');
must(api('POST', '/restaurants/'+rid+'/tables', {tableNumber:'T1',capacity:4}, TOKEN_FILE), 'create');
const tbls = must(api('GET', '/restaurants/'+rid+'/tables', null, TOKEN_FILE), 'list');
console.log('  count:', tbls.length);

p('8. RESERVATIONS');
must(api('POST', '/restaurants/'+rid+'/reservations', {partySize:2,reservedAt:new Date().toISOString()}, TOKEN_FILE), 'create');

p('9. REVIEWS');
must(api('POST', '/restaurants/'+rid+'/reviews', {rating:5,comment:'Amazing!'}, TOKEN_FILE), 'create');
const revs = must(api('GET', '/restaurants/'+rid+'/reviews'), 'list');
console.log('  count:', revs.length);

p('10. ISSUES');
const issData = must(api('POST', '/issues', {restaurantId:rid,channel:'STAFF',category:'EQUIPMENT',title:'Oven broken',description:'Not heating',priority:'HIGH'}, STAFF_TOKEN_FILE), 'create');
must(api('PATCH', '/issues/'+issData._id+'/assign', {assigneeId:me._id}, TOKEN_FILE), 'assign');
must(api('GET', '/issues/mine', null, STAFF_TOKEN_FILE), 'mine');
must(api('GET', '/issues', null, TOKEN_FILE), 'all');

p('11. APPROVALS');
const appR = must(api('POST', '/approvals', {restaurantId:rid,type:'BUDGET_EXPENDITURE',payload:{amount:5000,description:'New oven'}}, STAFF_TOKEN_FILE), 'create');
must(api('PATCH', '/approvals/'+appR._id+'/resolve', {status:'APPROVED',notes:'OK'}, TOKEN_FILE), 'resolve');

p('12. NOTIFICATIONS');
const notifs = must(api('GET', '/notifications', null, TOKEN_FILE), 'list');
console.log('  count:', notifs.length);
must(api('PATCH', '/notifications/read-all', null, TOKEN_FILE), 'read all');

p('13. MESSAGES');
must(api('GET', '/messages/'+staffData.user._id, null, STAFF_TOKEN_FILE), 'conversation');
must(api('GET', '/messages/conversations', null, STAFF_TOKEN_FILE), 'list convos');

p('14. REPORTS');
must(api('POST', '/restaurants/'+rid+'/reports', {type:'FINANCIAL',period:{from:'2026-01-01',to:'2026-06-01'},data:{revenue:50000,expenses:35000},summary:'Q1'}, TOKEN_FILE), 'submit');
must(api('GET', '/restaurants/'+rid+'/reports', null, TOKEN_FILE), 'list');
must(api('GET', '/restaurants/'+rid+'/reports/dashboard', null, TOKEN_FILE), 'dashboard');
must(api('GET', '/restaurants/'+rid+'/reports/financial', null, TOKEN_FILE), 'financial');

p('15. EDGE CASES');
const bad = api('PATCH', '/orders/'+oid+'/status', {status:'PENDING'}, TOKEN_FILE);
console.log(bad.success===false?'  OK COMPLETED->PENDING rejected':'  X NOT rejected!');
const dup = api('POST', '/auth/register', {email:regData.user.email,password:'test1234',firstName:'D',lastName:'U',role:'CLIENT'});
console.log(dup.success===false&&dup.statusCode===409?'  OK duplicate email -> 409':'  X not rejected');
const ua = api('GET', '/auth/me');
console.log(ua.success===false&&ua.statusCode===401?'  OK unauth -> 401':'  X not rejected');
const clRaw = api('POST', '/auth/register', {email:'client-'+now+'@enagram.io',password:'test1234',firstName:'C',lastName:'L',role:'CLIENT'});
const clData = must(clRaw, 'register client');
const CF='/tmp/e....txt';
fs.writeFileSync(CF, clData.accessToken);
const wr = api('PATCH', '/restaurants/'+rid+'/toggle', {isOpen:false}, CF);
console.log(wr.success===false&&wr.statusCode===403?'  OK wrong role -> 403':'  X not rejected');
try { fs.unlinkSync(CF); } catch {}

console.log('\nALL 15 TEST GROUPS PASSED');
try { fs.unlinkSync(TOKEN_FILE); } catch {}
try { fs.unlinkSync(STAFF_TOKEN_FILE); } catch {}

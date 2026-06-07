import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:4000/api/v1';
let results = [];

const log = (name, status, detail) => {
  const s = status ? '✅' : '❌';
  results.push(`${s} ${name}: ${detail}`);
};

const curl = (method, path, body, token) => {
  const headers = ['-H "Content-Type: application/json"'];
  if (token) headers.push(`-H "Authorization: Bearer ${token}"`);
  const bodyStr = body ? `-d '${JSON.stringify(body)}'` : '';
  const cmd = `curl -s -o /dev/null -w "%{http_code}" -X ${method} ${BASE}${path} ${headers.join(' ')} ${bodyStr}`;
  try {
    return parseInt(execSync(cmd).toString().trim());
  } catch { return 0; }
};

const curlJson = (method, path, body, token) => {
  const headers = ['-H "Content-Type: application/json"'];
  if (token) headers.push(`-H "Authorization: Bearer ${token}"`);
  const bodyStr = body ? `-d '${JSON.stringify(body)}'` : '';
  const cmd = `curl -s -X ${method} ${BASE}${path} ${headers.join(' ')} ${bodyStr}`;
  try {
    return JSON.parse(execSync(cmd).toString());
  } catch { return null; }
};

// 1. Health
const h = curl('GET', '/health');
log('Health', h === 200, h);

// 2. Register owner
const reg = curlJson('POST', '/auth/register', { email: 'owner2@enagram.io', password: 'pass1234', firstName: 'Owner', lastName: 'Two', role: 'OWNER' });
log('Register owner', reg?.statusCode === 201, reg?.statusCode || 'failed');
const ownerToken = reg?.data?.accessToken;

// 3. Login
const login = curlJson('POST', '/auth/login', { email: 'owner2@enagram.io', password: 'pass1234' });
log('Login', login?.statusCode === 200, login?.statusCode || 'failed');

// 4. Get me
const me = curlJson('GET', '/auth/me', null, ownerToken);
log('Get me', me?.statusCode === 200, me?.statusCode || 'failed');

// 5. Create restaurant
const rest = curlJson('POST', '/restaurants', {
  name: 'Test Bistro',
  address: { street: '123 Main', city: 'NYC', province: 'NY', country: 'USA' },
  contact: { phone: '+12125551234' }
}, ownerToken);
log('Create restaurant', rest?.statusCode === 201, rest?.statusCode || 'failed');
const restId = rest?.data?._id;

// 6. List restaurants (public)
const list = curl('GET', '/restaurants');
log('List restaurants', list === 200, list);

// 7. Get restaurant by id
const getOne = curl('GET', `/restaurants/${restId}`);
log('Get restaurant', getOne === 200, getOne);

// 8. Toggle restaurant
const toggle = curl('PATCH', `/restaurants/${restId}/toggle`, null, ownerToken);
log('Toggle restaurant', toggle === 200, toggle);

// 9. Create staff (HR_MANAGER)
const staff = curlJson('POST', `/restaurants/${restId}/staff`, {
  firstName: 'Jane', lastName: 'HR', phone: '+15550001', role: 'HR_MANAGER'
}, ownerToken);
log('Create staff', staff?.statusCode === 201, staff?.statusCode || 'failed');

// 10. Create menu
const menu = curlJson('POST', `/restaurants/${restId}/menus`, {
  name: 'Main Menu', description: 'Our main offerings'
}, ownerToken);
log('Create menu', menu?.statusCode === 201, menu?.statusCode || 'failed');
const menuId = menu?.data?._id;

// 11. Add menu item
const item = curlJson('POST', `/restaurants/${restId}/menus/${menuId}/items`, {
  name: 'Burger', price: 2400, category: 'Mains', isAvailable: true
}, ownerToken);
log('Add menu item', item?.statusCode === 201, item?.statusCode || 'failed');

// 12. Create order (need CLIENT token)
const clientReg = curlJson('POST', '/auth/register', { email: 'client2@enagram.io', password: 'pass1234', firstName: 'Client', lastName: 'Two', role: 'CLIENT' });
const clientToken = clientReg?.data?.accessToken;

const order = curlJson('POST', '/orders', {
  restaurantId: restId,
  type: 'DINE_IN',
  items: [{ menuItemId: '000000000000000000000000', name: 'Burger', price: 2400, quantity: 1 }]
}, clientToken);
log('Create order', order?.statusCode === 201, order?.statusCode || 'failed');
const orderId = order?.data?._id;

// 13. Get order
const getOrder = curl('GET', `/orders/${orderId}`, null, clientToken);
log('Get order', getOrder === 200, getOrder);

// 14. Update order status
const updOrder = curl('PATCH', `/orders/${orderId}/status`, { status: 'CONFIRMED' }, clientToken);
log('Update order status', updOrder === 200, updOrder);

// 15. Create issue
const issue = curlJson('POST', '/issues', {
  restaurantId: restId, channel: 'STAFF', category: 'EQUIPMENT',
  title: 'Test issue', description: 'Test description'
}, ownerToken);
log('Create issue', issue?.statusCode === 201, issue?.statusCode || 'failed');

// 16. List issues
const issues = curl('GET', '/issues', null, ownerToken);
log('List issues', issues === 200, issues);

// 17. Create approval request
const approval = curlJson('POST', '/approvals', {
  restaurantId: restId, type: 'BUDGET_EXPENDITURE',
  payload: { amount: 500, description: 'Test' }
}, ownerToken);
log('Create approval', approval?.statusCode === 201, approval?.statusCode || 'failed');

// 18. List approvals
const approvals = curl('GET', '/approvals', null, ownerToken);
log('List approvals', approvals === 200, approvals);

// 19. Notifications
const notifs = curl('GET', '/notifications', null, ownerToken);
log('List notifications', notifs === 200, notifs);

// 20. Submit report
const report = curlJson('POST', `/restaurants/${restId}/reports`, {
  type: 'OPERATIONAL', period: { from: '2024-01-01', to: '2024-01-31' },
  data: { metric: 42 }, summary: 'Test report'
}, ownerToken);
log('Submit report', report?.statusCode === 201, report?.statusCode || 'failed');

// 21. Messages
const conv = curl('GET', '/messages/conversations', null, ownerToken);
log('List conversations', conv === 200, conv);

// Print results
console.log('\n=== VERIFICATION RESULTS ===');
results.forEach(r => console.log(r));
const passed = results.filter(r => r.startsWith('✅')).length;
const total = results.length;
console.log(`\n${passed}/${total} endpoints verified`);
writeFileSync('/tmp/verify_results.txt', results.join('\n'));

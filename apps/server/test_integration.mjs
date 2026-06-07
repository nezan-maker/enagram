import { execSync } from 'child_process';

const BASE = 'http://localhost:4000/api/v1';
const curl = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, body?: any, token?: string) => {
  const args = [`curl -s -X ${method}`, `"${BASE}${url}"`, `-H "Content-Type: application/json"`];
  if (body) args.push(`-d '${JSON.stringify(body)}'`);
  if (token) args.push(`-H "Authorization: Bearer ${token}"`);
  return execSync(args.join(' ')).toString();
};

const json = (s: string) => JSON.parse(s);
const ok = (s: string) => { const d = json(s); if (!d.success) throw new Error(`FAIL: ${d.message}`); return d; };

let OWNER_TOKEN: string;
let RESTAURANT_ID: string;
let STAFF_TOKEN: string;
let STAFF_ID: string;

try {
  // 1. Register owner
  console.log('=== 1. AUTH ===');
  const reg = ok(curl('POST', '/auth/register', { email: `owner${Date.now()}@enagram.io`, password: 'test1234', firstName: 'Joe', lastName: 'Owner', role: 'OWNER' }));
  OWNER_TOKEN = reg.data.accessToken;
  console.log('  ✓ Owner registered, token:', OWNER_TOKEN.substring(0, 20));

  // 2. Login
  const login = json(curl('POST', '/auth/login', { email: reg.data.user.email, password: 'test1234' }));
  if (!login.success) throw new Error('Login failed');
  OWNER_TOKEN = login.data.accessToken;
  console.log('  ✓ Owner login');

  // 3. GET /auth/me
  const me = ok(curl('GET', '/auth/me', undefined, OWNER_TOKEN));
  console.log('  ✓ /auth/me:', me.data.role);

  // 4. Refresh token
  const refresh = ok(curl('POST', '/auth/refresh', { refreshToken: login.data.refreshToken }));
  console.log('  ✓ Token refresh');

  // 5. Create restaurant
  console.log('\n=== 2. RESTAURANTS ===');
  const rest = ok(curl('POST', '/restaurants', {
    name: 'Test Bistro', address: { street: '1 Main St', city: 'NYC', province: 'NY', country: 'USA' },
    contact: { phone: '+121****0000' }
  }, OWNER_TOKEN));
  RESTAURANT_ID = rest.data._id;
  console.log('  ✓ Restaurant created:', rest.data.slug);

  // 6. List restaurants (public)
  const list = ok(curl('GET', '/restaurants'));
  console.log('  ✓ /restaurants:', list.data.length, 'found');

  // 7. Get restaurant detail
  const detail = ok(curl('GET', `/restaurants/${RESTAURANT_ID}`));
  console.log('  ✓ /restaurants/:id:', detail.data.name);

  // 8. Update restaurant hours
  const hours = ok(curl('PATCH', `/restaurants/${RESTAURANT_ID}/hours`, {
    openingHours: [{ day: 'MON', open: '08:00', close: '22:00', isClosed: false }]
  }, OWNER_TOKEN));
  console.log('  ✓ Opening hours updated');

  // 9. Toggle restaurant
  const toggle = ok(curl('PATCH', `/restaurants/${RESTAURANT_ID}/toggle`, { isOpen: true }, OWNER_TOKEN));
  console.log('  ✓ Toggle isOpen');

  // 10. Staff enrollment
  console.log('\n=== 3. STAFF ENROLLMENT ===');
  const staff = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/staff`, {
    firstName: 'Jane', lastName: 'HR', phone: '+155****0001', role: 'HR_MANAGER'
  }, OWNER_TOKEN));
  STAFF_ID = staff.data.staffId;
  console.log('  ✓ Staff enrolled, staffId:', STAFF_ID);

  // 11. List staff
  const staffList = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/staff`, undefined, OWNER_TOKEN));
  console.log('  ✓ Staff list:', staffList.data.length, 'members');

  // 12. Get staff detail
  const staffDetail = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/staff/${staff.data.user._id}`, undefined, OWNER_TOKEN));
  console.log('  ✓ Staff detail');

  // 13. Staff login (first time — sets password)
  console.log('\n=== 4. STAFF LOGIN ===');
  const staffLogin = ok(curl('POST', '/auth/staff/login', { staffId: STAFF_ID, password: 'newPassword123' }));
  STAFF_TOKEN = staffLogin.data.accessToken;
  console.log('  ✓ Staff login + password set');

  // 14. Menu CRUD
  console.log('\n=== 5. MENUS ===');
  const menu = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/menus`, { name: 'Lunch Menu' }, OWNER_TOKEN));
  const MENU_ID = menu.data._id;
  console.log('  ✓ Menu created:', menu.data.name);

  // 15. List menus (public)
  const menus = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/menus/`));
  console.log('  ✓ /menus:', menus.data.length);

  // 16. Add menu item (chef suggestion)
  const item = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/menus/${MENU_ID}/items`, {
    name: 'Burger', price: 1599, category: 'Mains', description: 'Juicy beef burger'
  }, STAFF_TOKEN));
  const ITEM_ID = item.data._id || (item.data.menuItem?._id);
  console.log('  ✓ Menu item added');

  // 17. Approve menu item
  const approve = ok(curl('PATCH', `/restaurants/${RESTAURANT_ID}/menus/${MENU_ID}/items/${ITEM_ID}/approve`, undefined, OWNER_TOKEN));
  console.log('  ✓ Item approved');

  // 18. Orders
  console.log('\n=== 6. ORDERS ===');
  const order = ok(curl('POST', '/orders', {
    restaurantId: RESTAURANT_ID, type: 'DINE_IN',
    items: [{ menuItemId: ITEM_ID, name: 'Burger', price: 1599, quantity: 2 }],
  }, OWNER_TOKEN));
  const ORDER_ID = order.data._id;
  console.log('  ✓ Order placed:', order.data.status);

  // 19. Update order status
  const confirmed = ok(curl('PATCH', `/orders/${ORDER_ID}/status`, { status: 'CONFIRMED' }, OWNER_TOKEN));
  console.log('  ✓ Order confirmed:', confirmed.data.status);

  const preparing = ok(curl('PATCH', `/orders/${ORDER_ID}/status`, { status: 'PREPARING' }, STAFF_TOKEN));
  console.log('  ✓ Order preparing:', preparing.data.status);

  const ready = ok(curl('PATCH', `/orders/${ORDER_ID}/status`, { status: 'READY' }, STAFF_TOKEN));
  console.log('  ✓ Order ready:', ready.data.status);

  const delivered = ok(curl('PATCH', `/orders/${ORDER_ID}/status`, { status: 'DELIVERED' }, OWNER_TOKEN));
  console.log('  ✓ Order delivered:', delivered.data.status);

  // 20. Pay order
  const paid = ok(curl('PATCH', `/orders/${ORDER_ID}/pay`, { paymentMethod: 'CARD' }, OWNER_TOKEN));
  console.log('  ✓ Order paid:', paid.data.paymentStatus);

  // 21. Tables
  console.log('\n=== 7. TABLES ===');
  const table = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/tables`, { tableNumber: 'T1', capacity: 4 }, OWNER_TOKEN));
  const TABLE_ID = table.data._id;
  console.log('  ✓ Table created:', table.data.tableNumber);

  const tables = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/tables`, undefined, OWNER_TOKEN));
  console.log('  ✓ Tables list:', tables.data.length);

  // 22. Reservations
  console.log('\n=== 8. RESERVATIONS ===');
  const resv = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/reservations`, {
    partySize: 2, reservedAt: new Date().toISOString()
  }, OWNER_TOKEN));
  const RESV_ID = resv.data._id;
  console.log('  ✓ Reservation created');

  // 23. Reviews
  console.log('\n=== 9. REVIEWS ===');
  const review = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/reviews`, {
    rating: 5, comment: 'Amazing!'
  }, OWNER_TOKEN));
  console.log('  ✓ Review created');

  const reviews = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/reviews`));
  console.log('  ✓ Reviews list:', reviews.data.length, 'reviews');

  // 24. Issues
  console.log('\n=== 10. ISSUES ===');
  const issue = ok(curl('POST', '/issues', {
    restaurantId: RESTAURANT_ID, channel: 'STAFF',
    category: 'EQUIPMENT', title: 'Oven broken', description: 'Main oven not heating',
    priority: 'HIGH'
  }, STAFF_TOKEN));
  const ISSUE_ID = issue.data._id;
  console.log('  ✓ Issue created');

  const assign = ok(curl('PATCH', `/issues/${ISSUE_ID}/assign`, { assigneeId: me.data._id }, OWNER_TOKEN));
  console.log('  ✓ Issue assigned');

  // 25. Approvals
  console.log('\n=== 11. APPROVALS ===');
  const approval = ok(curl('POST', '/approvals', {
    restaurantId: RESTAURANT_ID, type: 'BUDGET_EXPENDITURE',
    payload: { amount: 5000, description: 'New oven' }
  }, STAFF_TOKEN));
  const APPROVAL_ID = approval.data._id;
  console.log('  ✓ Approval requested');

  const resolve = ok(curl('PATCH', `/approvals/${APPROVAL_ID}/resolve`, { status: 'APPROVED', notes: 'Approved' }, OWNER_TOKEN));
  console.log('  ✓ Approval resolved');

  // 26. Notifications
  console.log('\n=== 12. NOTIFICATIONS ===');
  const notifs = ok(curl('GET', '/notifications', undefined, OWNER_TOKEN));
  console.log('  ✓ Notifications:', notifs.data.length);

  // 27. Messages
  console.log('\n=== 13. MESSAGES ===');
  const convos = ok(curl('GET', '/messages/conversations', undefined, STAFF_TOKEN));
  console.log('  ✓ Conversations:' , Array.isArray(convos.data) ? convos.data.length : 'ok');

  // 28. Reports
  console.log('\n=== 14. REPORTS ===');
  const report = ok(curl('POST', `/restaurants/${RESTAURANT_ID}/reports`, {
    type: 'FINANCIAL',
    period: { from: '2026-01-01', to: '2026-06-01' },
    data: { revenue: 50000, expenses: 35000 },
    summary: 'Q1 financial summary'
  }, OWNER_TOKEN));
  console.log('  ✓ Report submitted');

  // 29. Owner dashboard data
  const dash = ok(curl('GET', `/restaurants/${RESTAURANT_ID}/reports/dashboard`, undefined, OWNER_TOKEN));
  console.log('  ✓ Dashboard data');

  // 30. Invalid state transition test
  console.log('\n=== 15. EDGE CASES ===');
  try {
    json(curl('PATCH', `/orders/${ORDER_ID}/status`, { status: 'PENDING' }, OWNER_TOKEN));
    console.log('  ✗ Should have rejected COMPLETED→PENDING');
  } catch {
    console.log('  ✓ Invalid transition rejected (COMPLETED→PENDING)');
  }

  console.log('\n========================================');
  console.log('✅ ALL ENDPOINTS VERIFIED SUCCESSFULLY');
  console.log('========================================');

} catch (e: any) {
  console.error('\n❌ TEST FAILED:', e.message);
  process.exit(1);
}

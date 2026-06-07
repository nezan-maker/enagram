const { spawnSync } = require('child_process');
const fs = require('fs');
const BASE = 'http://localhost:4000/api/v1';

function api(method, path, body, tokenFile) {
  const args = ['-s', '-X', method, BASE+path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  if (tokenFile) {
    const t = fs.readFileSync(tokenFile, 'utf8').trim();
    args.push('-H', 'authorization: bearer *** t);
  }
  const proc = spawnSync('curl', args, {encoding:'utf8',timeout:10000});
  return JSON.parse(proc.stdout);
}

// Register + create restaurant + add menu item
const now = Date.now();
const reg = api('POST', '/auth/register', {email:'debug-'+now+'@t.io',password:'test1234',firstName:'D',lastName:'B',role:'OWNER'});
console.log('REG:', reg.message);

const tokFile = '/tmp/e....txt';
fs.writeFileSync(tokFile, reg.data.accessToken);

const rest = api('POST', '/restaurants', {name:'Debug R',address:{street:'1 St',city:'NYC',province:'NY',country:'USA'},contact:{phone:'+121****0000'}}, tokFile);
const rid = rest.data._id;
console.log('REST:', rid);

const menu = api('POST', '/restaurants/'+rid+'/menus', {name:'Test'}, tokFile);
const mid = menu.data._id;

const item = api('POST', '/restaurants/'+rid+'/menus/'+mid+'/items', {name:'Burger',price:1599,category:'M',description:'J'}, tokFile);
const iid = item.data._id || (item.data.menuItem && item.data.menuItem._id);
console.log('ITEM:', iid);

// Try placing order
const order = api('POST', '/orders', {restaurantId:rid,type:'DINE_IN',items:[{menuItemId:iid,name:'Burger',price:1599,quantity:2}]}, tokFile);
console.log('ORDER result:', JSON.stringify(order));

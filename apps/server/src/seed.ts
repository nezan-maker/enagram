// Run: cd apps/server && npx tsx src/seed.ts
import mongoose from 'mongoose';
import { User } from './models/User.model.js';
import { Restaurant } from './models/Restaurant.model.js';
import { Menu } from './models/Menu.model.js';
import { MenuItem } from './models/MenuItem.model.js';
import { Table } from './models/Table.model.js';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error('MONGO_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('Connected to', uri);

  // Clear existing seed data
  const seedSlugs = [
    'lumiere-dining', 'onyx-bistro', 'iron-forge-steak',
    'sakura-ramen', 'la-cucina', 'douceurs-patisserie', 'velvet-lounge',
  ];
  await Restaurant.deleteMany({ slug: { $in: seedSlugs } });
  await Menu.deleteMany({});
  await MenuItem.deleteMany({});
  await Table.deleteMany({});

  // Reuse or create owner
  let owner = await User.findOne({ email: 'owner-seed@enagram.com' });
  if (!owner) {
    const password = await bcrypt.hash('password123', 4);
    owner = await User.create({
      email: 'owner-seed@enagram.com', password, role: 'OWNER',
      firstName: 'James', lastName: 'Owner',
      isActive: true, isPasswordSet: true,
    });
  }
  console.log('Owner:', owner._id);

  // 7 restaurants covering all 8 cuisine categories
  const restaurants = await Restaurant.create([
    {
      ownerId: owner._id, name: 'Lumiere Dining', slug: 'lumiere-dining',
      description: 'An intimate fine-dining experience blending French technique with Rwandan ingredients. Every plate tells a story of tradition reimagined.',
      cuisineType: ['Modern Fusion', 'Fine Dining'],
      address: { street: '12 KG 7 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 100 200', email: 'reservations@lumiere.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.9, reviewCount: 124,
      openingHours: [
        { day: 'MON', open: '11:00', close: '22:00', isClosed: false },
        { day: 'TUE', open: '11:00', close: '22:00', isClosed: false },
        { day: 'WED', open: '11:00', close: '22:00', isClosed: false },
        { day: 'THU', open: '11:00', close: '22:00', isClosed: false },
        { day: 'FRI', open: '11:00', close: '23:00', isClosed: false },
        { day: 'SAT', open: '10:00', close: '23:00', isClosed: false },
        { day: 'SUN', open: '10:00', close: '21:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'Onyx Bistro', slug: 'onyx-bistro',
      description: 'Contemporary African bistro serving bold flavors in a warm, minimalist space. Coffee, cocktails, and communal dining.',
      cuisineType: ['Contemporary', 'African'],
      address: { street: '45 KG 9 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 200 300', email: 'hello@onyx.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.7, reviewCount: 89,
      openingHours: [
        { day: 'MON', open: '08:00', close: '22:00', isClosed: false },
        { day: 'TUE', open: '08:00', close: '22:00', isClosed: false },
        { day: 'WED', open: '08:00', close: '22:00', isClosed: false },
        { day: 'THU', open: '08:00', close: '23:00', isClosed: false },
        { day: 'FRI', open: '08:00', close: '23:00', isClosed: false },
        { day: 'SAT', open: '09:00', close: '23:00', isClosed: false },
        { day: 'SUN', open: '09:00', close: '20:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'Iron Forge Steak', slug: 'iron-forge-steak',
      description: 'Wood-fired steaks, craft cocktails, and a rugged industrial atmosphere. Where the grill is the heart of the kitchen.',
      cuisineType: ['Steakhouse', 'Grill'],
      address: { street: '78 Boulevard de la Révolution', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 300 400', email: 'info@ironforge.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.8, reviewCount: 203,
      openingHours: [
        { day: 'MON', open: '17:00', close: '23:00', isClosed: false },
        { day: 'TUE', open: '17:00', close: '23:00', isClosed: false },
        { day: 'WED', open: '17:00', close: '23:00', isClosed: false },
        { day: 'THU', open: '17:00', close: '23:00', isClosed: false },
        { day: 'FRI', open: '17:00', close: '00:00', isClosed: false },
        { day: 'SAT', open: '14:00', close: '00:00', isClosed: false },
        { day: 'SUN', open: '14:00', close: '22:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'Sakura Ramen', slug: 'sakura-ramen',
      description: 'Authentic Japanese ramen crafted with slow-simmered broths, fresh noodles, and seasonal toppings. A bowl of comfort in every sip.',
      cuisineType: ['Japanese', 'Ramen'],
      address: { street: '23 KG 15 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 400 500', email: 'hello@sakura.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.6, reviewCount: 67,
      openingHours: [
        { day: 'MON', open: '11:00', close: '21:00', isClosed: false },
        { day: 'TUE', open: '11:00', close: '21:00', isClosed: false },
        { day: 'WED', open: '11:00', close: '21:00', isClosed: false },
        { day: 'THU', open: '11:00', close: '21:00', isClosed: false },
        { day: 'FRI', open: '11:00', close: '22:00', isClosed: false },
        { day: 'SAT', open: '12:00', close: '22:00', isClosed: false },
        { day: 'SUN', open: '12:00', close: '20:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'La Cucina', slug: 'la-cucina',
      description: 'Traditional Italian trattoria serving hand-rolled pasta, wood-fired pizzas, and regional wines from Tuscany to Sicilia.',
      cuisineType: ['Italian', 'Pizza', 'Pasta'],
      address: { street: '56 KG 21 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 500 600', email: 'info@lacucina.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.5, reviewCount: 156,
      openingHours: [
        { day: 'MON', open: '12:00', close: '22:00', isClosed: false },
        { day: 'TUE', open: '12:00', close: '22:00', isClosed: false },
        { day: 'WED', open: '12:00', close: '22:00', isClosed: false },
        { day: 'THU', open: '12:00', close: '22:00', isClosed: false },
        { day: 'FRI', open: '12:00', close: '23:00', isClosed: false },
        { day: 'SAT', open: '12:00', close: '23:00', isClosed: false },
        { day: 'SUN', open: '13:00', close: '21:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'Douceurs Patisserie', slug: 'douceurs-patisserie',
      description: 'French-inspired patisserie and café. Croissants, éclairs, tarts, and single-origin coffee in an elegant daytime space.',
      cuisineType: ['Patisserie', 'Bakery', 'Dessert'],
      address: { street: '8 KG 3 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 600 700', email: 'bonjour@douceurs.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.4, reviewCount: 42,
      openingHours: [
        { day: 'MON', open: '07:00', close: '18:00', isClosed: false },
        { day: 'TUE', open: '07:00', close: '18:00', isClosed: false },
        { day: 'WED', open: '07:00', close: '18:00', isClosed: false },
        { day: 'THU', open: '07:00', close: '18:00', isClosed: false },
        { day: 'FRI', open: '07:00', close: '19:00', isClosed: false },
        { day: 'SAT', open: '08:00', close: '19:00', isClosed: false },
        { day: 'SUN', open: '08:00', close: '15:00', isClosed: false },
      ],
    },
    {
      ownerId: owner._id, name: 'Velvet Lounge', slug: 'velvet-lounge',
      description: 'Rooftop cocktail bar with panoramic city views, craft mixology, curated wine list, and late-night small plates.',
      cuisineType: ['Nightlife', 'Bar', 'Cocktail', 'Lounge'],
      address: { street: '100 KG 1 Ave', city: 'Kigali', province: 'Kigali City', country: 'Rwanda' },
      contact: { phone: '+250 788 700 800', email: 'reservations@velvet.rw' },
      isOpen: true, isProfileComplete: true, averageRating: 4.3, reviewCount: 88,
      openingHours: [
        { day: 'MON', open: '18:00', close: '02:00', isClosed: true },
        { day: 'TUE', open: '18:00', close: '02:00', isClosed: true },
        { day: 'WED', open: '18:00', close: '02:00', isClosed: false },
        { day: 'THU', open: '18:00', close: '02:00', isClosed: false },
        { day: 'FRI', open: '18:00', close: '04:00', isClosed: false },
        { day: 'SAT', open: '18:00', close: '04:00', isClosed: false },
        { day: 'SUN', open: '18:00', close: '00:00', isClosed: false },
      ],
    },
  ]);
  console.log(`Seeded ${restaurants.length} restaurants`);

  // Menu items for each
  for (const r of restaurants) {
    const menu = await Menu.create({ restaurantId: r._id, name: 'Main Menu', createdBy: owner._id, isActive: true });
    const items: any[] = [];
    if (r.cuisineType?.some((c) => ['Japanese', 'Ramen'].includes(c))) {
      items.push(
        { menuId: menu._id, restaurantId: r._id, name: 'Tonkotsu Ramen', price: 16.00, category: 'MAIN', isAvailable: true, approvalStatus: 'APPROVED', description: 'Rich pork bone broth, chashu, soft egg, nori' },
        { menuId: menu._id, restaurantId: r._id, name: 'Gyoza', price: 9.00, category: 'STARTER', isAvailable: true, approvalStatus: 'APPROVED', description: 'Pan-fried pork dumplings with dipping sauce' },
        { menuId: menu._id, restaurantId: r._id, name: 'Matcha Tiramisu', price: 11.00, category: 'DESSERT', isAvailable: true, approvalStatus: 'APPROVED', description: 'Layered matcha mascarpone with cocoa dust' },
      );
    } else if (r.cuisineType?.some((c) => ['Italian', 'Pizza', 'Pasta'].includes(c))) {
      items.push(
        { menuId: menu._id, restaurantId: r._id, name: 'Margherita Pizza', price: 14.00, category: 'MAIN', isAvailable: true, approvalStatus: 'APPROVED', description: 'San Marzano tomato, fresh mozzarella, basil' },
        { menuId: menu._id, restaurantId: r._id, name: 'Bruschetta', price: 8.00, category: 'STARTER', isAvailable: true, approvalStatus: 'APPROVED', description: 'Toasted sourdough, tomato, garlic, olive oil' },
        { menuId: menu._id, restaurantId: r._id, name: 'Panna Cotta', price: 10.00, category: 'DESSERT', isAvailable: true, approvalStatus: 'APPROVED', description: 'Vanilla panna cotta with berry compote' },
      );
    } else if (r.cuisineType?.some((c) => ['Patisserie', 'Bakery', 'Dessert'].includes(c))) {
      items.push(
        { menuId: menu._id, restaurantId: r._id, name: 'Croissant aux Amandes', price: 6.00, category: 'PASTRY', isAvailable: true, approvalStatus: 'APPROVED', description: 'Almond croissant with frangipane filling' },
        { menuId: menu._id, restaurantId: r._id, name: 'Chocolate Éclair', price: 7.00, category: 'PASTRY', isAvailable: true, approvalStatus: 'APPROVED', description: 'Choux pastry with dark chocolate ganache' },
        { menuId: menu._id, restaurantId: r._id, name: 'Flat White', price: 4.50, category: 'BEVERAGE', isAvailable: true, approvalStatus: 'APPROVED', description: 'Single-origin Ethiopian, double shot' },
      );
    } else if (r.cuisineType?.some((c) => ['Nightlife', 'Bar', 'Cocktail', 'Lounge'].includes(c))) {
      items.push(
        { menuId: menu._id, restaurantId: r._id, name: 'Signature Negroni', price: 14.00, category: 'COCKTAIL', isAvailable: true, approvalStatus: 'APPROVED', description: 'Gin, Campari, sweet vermouth, orange twist' },
        { menuId: menu._id, restaurantId: r._id, name: 'Wine Flight', price: 22.00, category: 'WINE', isAvailable: true, approvalStatus: 'APPROVED', description: 'Three 120ml pours of curated selection' },
        { menuId: menu._id, restaurantId: r._id, name: 'Charcuterie Board', price: 18.00, category: 'SMALL PLATE', isAvailable: true, approvalStatus: 'APPROVED', description: 'Curated meats, cheeses, pickles, flatbread' },
      );
    } else {
      items.push(
        { menuId: menu._id, restaurantId: r._id, name: 'Truffle Arancini', price: 14.00, category: 'STARTER', isAvailable: true, approvalStatus: 'APPROVED', description: 'Crispy risotto balls with black truffle and parmesan' },
        { menuId: menu._id, restaurantId: r._id, name: 'Grilled Ribeye', price: 38.00, category: 'MAIN', isAvailable: true, approvalStatus: 'APPROVED', description: '300g grass-fed ribeye with chimichurri' },
        { menuId: menu._id, restaurantId: r._id, name: 'Chocolate Fondant', price: 12.00, category: 'DESSERT', isAvailable: true, approvalStatus: 'APPROVED', description: 'Warm dark chocolate with vanilla ice cream' },
      );
    }
    await MenuItem.create(items);
    console.log(`  ${r.name}: ${items.length} menu items (${r.cuisineType?.join(', ')})`);

    // Tables
    const tables = [];
    for (let i = 1; i <= 8; i++) {
      tables.push({ restaurantId: r._id, tableNumber: `T${i}`, capacity: i <= 4 ? 2 : 4, status: 'AVAILABLE' });
    }
    await Table.create(tables);
  }

  console.log('\n✅ Seed complete!');
  console.log('   7 restaurants covering: Japanese, Italian, Patisserie, Steakhouse, Fine Dining, Nightlife, Modern Fusion, African');
  console.log('   Owner email: owner-seed@enagram.com');
  console.log('   Password:    password123');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });

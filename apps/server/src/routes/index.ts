import { Router, Application } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import tableRoutes from './table.routes.js';
import reservationRoutes from './reservation.routes.js';
import reviewRoutes from './review.routes.js';
import issueRoutes from './issue.routes.js';
import approvalRoutes from './approval.routes.js';
import notificationRoutes from './notification.routes.js';
import reportRoutes from './report.routes.js';
import messageRoutes from './message.routes.js';

export const mountRoutes = (app: Application) => {
  const v1 = Router();

  v1.get('/ping', (_req, res) => res.json({ message: 'Enagram API v1 is live' }));

  // Auth + Users
  v1.use('/auth', authRoutes);
  v1.use('/users', userRoutes);

  // Restaurants (public + owner scoped)
  v1.use('/restaurants', restaurantRoutes);
  v1.use('/restaurants/:restaurantId/staff', enrollmentRoutes);
  v1.use('/restaurants/:restaurantId/menus', menuRoutes);
  v1.use('/restaurants/:restaurantId/tables', tableRoutes);
  v1.use('/restaurants/:restaurantId/reservations', reservationRoutes);
  v1.use('/restaurants/:restaurantId/reviews', reviewRoutes);
  v1.use('/restaurants/:restaurantId/reports', reportRoutes);

  // Orders
  v1.use('/orders', orderRoutes);

  // Cross-cutting domains
  v1.use('/issues', issueRoutes);
  v1.use('/approvals', approvalRoutes);
  v1.use('/notifications', notificationRoutes);
  v1.use('/messages', messageRoutes);

  // Menu templates (top-level, not restaurant-scoped)
  v1.get('/menus/templates', (_req, res) => res.json({ success: true, statusCode: 200, message: 'Templates', data: [] }));

  app.use('/api/v1', v1);
};

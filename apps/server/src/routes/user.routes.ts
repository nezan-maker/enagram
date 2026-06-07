import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as ctrl from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authenticate, ctrl.getMe);
router.patch('/me', authenticate, ctrl.updateMe);
router.get('/me/orders', authenticate, ctrl.getClientOrders);
router.post('/me/addresses', authenticate, ctrl.addAddress);
router.post('/me/favourites/:restaurantId', authenticate, ctrl.toggleFavourite);

export default router;

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/order.controller.js';

const router = Router();

router.post('/', authenticate, authorize('CLIENT', 'WAITER', 'OWNER'), ctrl.create);
router.get('/:id', authenticate, ctrl.getOne);
router.get('/restaurant/:id', authenticate, authorize('WAITER', 'CHEF', 'KITCHEN_MANAGER', 'DEPUTY_MANAGER'), ctrl.listByRestaurant);
router.get('/client/me', authenticate, authorize('CLIENT'), ctrl.listByClient);
router.patch('/:id/status', authenticate, authorize('CHEF', 'WAITER', 'KITCHEN_MANAGER', 'OWNER'), ctrl.updateStatus);
router.patch('/:id/pay', authenticate, authorize('WAITER', 'CLIENT', 'OWNER'), ctrl.markPaid);
router.delete('/:id', authenticate, ctrl.cancel);

export default router;

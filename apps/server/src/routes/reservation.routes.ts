import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/reservation.controller.js';

const router = Router({ mergeParams: true });

router.post('/', authenticate, authorize('CLIENT', 'OWNER'), ctrl.create);
router.get('/', authenticate, authorize('WAITER', 'KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.list);
router.patch('/:id', authenticate, authorize('WAITER', 'KITCHEN_MANAGER'), ctrl.updateStatus);
router.delete('/:id', authenticate, ctrl.cancel);

export default router;

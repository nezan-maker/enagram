import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/table.controller.js';

const router = Router({ mergeParams: true });

router.get('/', authenticate, authorize('WAITER', 'KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.list);
router.post('/', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.create);
router.patch('/:tableId', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.update);
router.delete('/:tableId', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.remove);
router.get('/:tableId/qr', authenticate, authorize('KITCHEN_MANAGER', 'OWNER'), ctrl.getQR);

export default router;

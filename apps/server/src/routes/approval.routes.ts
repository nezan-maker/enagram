import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/approval.controller.js';

const router = Router();

router.post('/', authenticate, ctrl.create);
router.get('/', authenticate, authorize('DEPUTY_MANAGER', 'OWNER'), ctrl.list);
router.patch('/:id/resolve', authenticate, authorize('DEPUTY_MANAGER', 'OWNER'), ctrl.resolve);

export default router;

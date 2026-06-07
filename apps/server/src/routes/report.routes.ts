import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/report.controller.js';

const router = Router({ mergeParams: true });

router.post('/', authenticate, authorize('DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'OWNER'), ctrl.create);
router.get('/', authenticate, authorize('DEPUTY_MANAGER', 'OWNER'), ctrl.list);
router.get('/dashboard', authenticate, authorize('OWNER'), ctrl.dashboard);
router.get('/financial', authenticate, authorize('FINANCE_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.financial);

export default router;

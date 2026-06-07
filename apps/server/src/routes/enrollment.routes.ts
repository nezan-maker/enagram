import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/enrollment.controller.js';

const router = Router({ mergeParams: true });

router.get('/', authenticate, authorize('OWNER', 'DEPUTY_MANAGER', 'HR_MANAGER'), ctrl.list);
router.post('/', authenticate, authorize('OWNER', 'HR_MANAGER'), ctrl.createSingle);
router.post('/bulk', authenticate, authorize('HR_MANAGER'), ctrl.bulkEnroll);
router.get('/:userId', authenticate, authorize('OWNER', 'DEPUTY_MANAGER', 'HR_MANAGER'), ctrl.getOne);
router.patch('/:userId', authenticate, authorize('HR_MANAGER'), ctrl.update);
router.patch('/:userId/deactivate', authenticate, authorize('HR_MANAGER'), ctrl.deactivate);
router.get('/:userId/staffId', authenticate, authorize('HR_MANAGER'), ctrl.getStaffId);

export default router;

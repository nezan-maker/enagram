import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/issue.controller.js';

const router = Router();

router.post('/', authenticate, ctrl.create);
router.get('/', authenticate, authorize('DEPUTY_MANAGER', 'OWNER'), ctrl.list);
router.get('/mine', authenticate, ctrl.listMine);
router.get('/:id', authenticate, ctrl.getOne);
router.patch('/:id', authenticate, ctrl.update);
router.patch('/:id/assign', authenticate, authorize('DEPUTY_MANAGER', 'OWNER'), ctrl.assign);

export default router;

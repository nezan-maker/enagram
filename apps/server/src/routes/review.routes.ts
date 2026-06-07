import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/review.controller.js';

const router = Router({ mergeParams: true });

router.post('/', authenticate, authorize('CLIENT', 'OWNER'), ctrl.create);
router.get('/', ctrl.list);
router.delete('/:id', authenticate, ctrl.remove);

export default router;

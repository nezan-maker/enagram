import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as ctrl from '../controllers/notification.controller.js';

const router = Router();

router.get('/', authenticate, ctrl.list);
router.patch('/:id/read', authenticate, ctrl.markRead);
router.patch('/read-all', authenticate, ctrl.markAllRead);

export default router;

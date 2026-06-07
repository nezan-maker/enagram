import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/message.controller.js';

const router = Router();

router.get('/conversations', authenticate, authorize('DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'CHEF', 'WAITER'), ctrl.listConversations);
router.get('/:userId', authenticate, authorize('DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'CHEF', 'WAITER'), ctrl.getConversation);
router.patch('/:userId/read', authenticate, authorize('DEPUTY_MANAGER', 'HR_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_MANAGER', 'CHEF', 'WAITER'), ctrl.markRead);

export default router;

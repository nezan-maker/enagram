import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import * as authCtrl from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authLimiter, ...authCtrl.register);
router.post('/login', authLimiter, ...authCtrl.login);
router.post('/staff/login', authLimiter, ...authCtrl.staffLoginCtrl);
router.post('/refresh', authCtrl.refresh);
router.post('/logout', authenticate, authCtrl.logout);
router.get('/me', authenticate, authCtrl.me);

export default router;

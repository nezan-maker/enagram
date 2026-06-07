import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as authCtrl from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', ...authCtrl.register);
router.post('/login', ...authCtrl.login);
router.post('/staff/login', ...authCtrl.staffLoginCtrl);
router.post('/refresh', authCtrl.refresh);
router.post('/logout', authenticate, authCtrl.logout);
router.get('/me', authenticate, authCtrl.me);

export default router;

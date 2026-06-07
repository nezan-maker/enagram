import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { uploadImage } from '../middleware/upload.js';
import * as ctrl from '../controllers/restaurant.controller.js';

const router = Router();

// Public
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// Owner+Deputy scoped
router.post('/', authenticate, authorize('OWNER'), ctrl.create);
router.patch('/:id', authenticate, authorize('OWNER', 'DEPUTY_MANAGER'), ctrl.update);
router.patch('/:id/hours', authenticate, authorize('OWNER', 'DEPUTY_MANAGER'), ctrl.updateHours);
router.patch('/:id/toggle', authenticate, authorize('OWNER', 'DEPUTY_MANAGER'), ctrl.toggle);
router.delete('/:id', authenticate, authorize('OWNER'), ctrl.remove);

// Staff list for a restaurant
router.get('/:id/staff', authenticate, authorize('OWNER', 'DEPUTY_MANAGER', 'HR_MANAGER'), ctrl.getStaff);

// Media upload (cover image, logo)
router.post('/:id/media', authenticate, authorize('OWNER', 'DEPUTY_MANAGER'), uploadImage.single('cover'), ctrl.uploadMedia);

export default router;

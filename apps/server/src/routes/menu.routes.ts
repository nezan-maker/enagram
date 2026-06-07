import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as ctrl from '../controllers/menu.controller.js';

const router = Router({ mergeParams: true });

// Public menu viewing
router.get('/', ctrl.listMenus);
router.get('/:menuId', ctrl.getMenu);

// Menu CRUD
router.post('/', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER', 'OWNER'), ctrl.createMenu);
router.patch('/:menuId', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER'), ctrl.updateMenu);
router.delete('/:menuId', authenticate, authorize('KITCHEN_MANAGER', 'DEPUTY_MANAGER'), ctrl.deleteMenu);

// Menu Items
router.post('/:menuId/items', authenticate, authorize('KITCHEN_MANAGER', 'CHEF', 'OWNER'), ctrl.addItem);
router.patch('/:menuId/items/:itemId', authenticate, authorize('KITCHEN_MANAGER'), ctrl.updateItem);
router.delete('/:menuId/items/:itemId', authenticate, authorize('KITCHEN_MANAGER'), ctrl.deleteItem);
router.patch('/:menuId/items/:itemId/approve', authenticate, authorize('KITCHEN_MANAGER', 'OWNER'), ctrl.approveItem);

export default router;

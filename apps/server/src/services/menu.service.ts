import { Menu } from '../models/Menu.model.js';
import { MenuItem, IMenuItem } from '../models/MenuItem.model.js';
import { ApprovalRequest } from '../models/ApprovalRequest.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

export const listMenus = async (restaurantId: string) => {
  return Menu.find({ restaurantId: new Types.ObjectId(restaurantId) }).lean();
};

export const getMenuWithItems = async (restaurantId: string, menuId: string) => {
  const menu = await Menu.findOne({ _id: menuId, restaurantId: new Types.ObjectId(restaurantId) }).lean();
  if (!menu) throw new ApiError(404, 'Menu not found');
  const items = await MenuItem.find({ menuId: menu._id, approvalStatus: 'APPROVED' }).lean();
  return { ...menu, items };
};

export const createMenu = async (restaurantId: string, createdBy: string, data: any) => {
  return Menu.create({ ...data, restaurantId: new Types.ObjectId(restaurantId), createdBy: new Types.ObjectId(createdBy) });
};

export const updateMenu = async (restaurantId: string, menuId: string, data: any) => {
  const menu = await Menu.findOne({ _id: menuId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!menu) throw new ApiError(404, 'Menu not found');
  Object.assign(menu, data);
  await menu.save();
  return menu;
};

export const deleteMenu = async (restaurantId: string, menuId: string) => {
  await MenuItem.deleteMany({ menuId: new Types.ObjectId(menuId) });
  const result = await Menu.deleteOne({ _id: menuId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!result.deletedCount) throw new ApiError(404, 'Menu not found');
  return { deleted: true };
};

// MenuItem operations with chef suggestion approval gate
export const addMenuItem = async (
  restaurantId: string, menuId: string, userId: string, role: string, data: Partial<IMenuItem>
) => {
  const isChefSuggestion = role === 'CHEF';

  const item = await MenuItem.create({
    ...data,
    menuId: new Types.ObjectId(menuId),
    restaurantId: new Types.ObjectId(restaurantId),
    approvalStatus: isChefSuggestion ? 'PENDING' : 'APPROVED',
    suggestedBy: isChefSuggestion ? new Types.ObjectId(userId) : undefined,
  });

  // If chef suggestion, create approval request
  if (isChefSuggestion) {
    await ApprovalRequest.create({
      restaurantId: new Types.ObjectId(restaurantId),
      requestedBy: new Types.ObjectId(userId),
      approverRole: 'KITCHEN_MANAGER',
      type: 'MENU_CHANGE',
      payload: { menuItemId: item._id, name: data.name, menuId },
      status: 'PENDING',
    });
  }

  return item;
};

export const updateMenuItem = async (restaurantId: string, itemId: string, data: Partial<IMenuItem>) => {
  const item = await MenuItem.findOne({ _id: itemId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!item) throw new ApiError(404, 'Menu item not found');
  Object.assign(item, data);
  await item.save();
  return item;
};

export const deleteMenuItem = async (restaurantId: string, itemId: string) => {
  const result = await MenuItem.deleteOne({ _id: itemId, restaurantId: new Types.ObjectId(restaurantId) });
  if (!result.deletedCount) throw new ApiError(404, 'Menu item not found');
  return { deleted: true };
};

export const approveMenuItem = async (itemId: string, approverId: string) => {
  const item = await MenuItem.findById(itemId);
  if (!item) throw new ApiError(404, 'Menu item not found');
  item.approvalStatus = 'APPROVED';
  item.approvedBy = new Types.ObjectId(approverId) as any;
  await item.save();
  return item;
};

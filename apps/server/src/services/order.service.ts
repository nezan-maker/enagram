import { Order, IOrder } from '../models/Order.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Types } from 'mongoose';

// Order state machine — Section 6 of Enagram.md
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

const validateTransition = (current: string, next: string): void => {
  const allowed = VALID_TRANSITIONS[current];
  if (!allowed || !allowed.includes(next)) {
    throw new ApiError(400, `Invalid state transition: ${current} → ${next}`);
  }
};

export const create = async (data: Partial<IOrder>, changedBy?: string): Promise<IOrder> => {
  const subtotal = data.items!.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const total = subtotal + tax;

  const order = await Order.create({
    ...data,
    subtotal,
    tax,
    total,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    statusHistory: [{
      status: 'PENDING',
      changedBy: data.waiterId || data.clientId || changedBy,
      changedAt: new Date(),
    }],
  });

  return order;
};

export const getById = async (id: string) => {
  const order = await Order.findById(id).lean();
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

export const listByRestaurant = async (restaurantId: string, status?: string) => {
  const filter: any = { restaurantId: new Types.ObjectId(restaurantId) };
  if (status) filter.status = status;
  return Order.find(filter).sort({ createdAt: -1 }).lean();
};

export const listByClient = async (clientId: string) => {
  return Order.find({ clientId: new Types.ObjectId(clientId) }).sort({ createdAt: -1 }).lean();
};

export const updateStatus = async (orderId: string, newStatus: string, changedBy: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  validateTransition(order.status, newStatus);

  order.status = newStatus;
  order.statusHistory.push({
    status: newStatus,
    changedBy: new Types.ObjectId(changedBy),
    changedAt: new Date(),
  });

  await order.save();
  return order;
};

export const markPaid = async (orderId: string, paymentMethod: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.paymentStatus = 'PAID';
  order.paymentMethod = paymentMethod as any;
  await order.save();
  return order;
};

export const cancel = async (orderId: string, changedBy: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  validateTransition(order.status, 'CANCELLED');

  order.status = 'CANCELLED';
  order.statusHistory.push({
    status: 'CANCELLED',
    changedBy: new Types.ObjectId(changedBy),
    changedAt: new Date(),
  });

  await order.save();
  return order;
};

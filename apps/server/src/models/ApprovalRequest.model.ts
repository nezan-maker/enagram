import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IApprovalRequest extends Document {
  restaurantId: Types.ObjectId;
  requestedBy: Types.ObjectId;
  approverRole: string;
  approverId?: Types.ObjectId;
  type: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  resolvedAt?: Date;
  createdAt: Date;
}

const approvalSchema = new Schema<IApprovalRequest>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approverRole: { type: String, required: true },
  approverId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true, enum: ['STAFF_TERMINATION', 'BUDGET_EXPENDITURE', 'MENU_CHANGE', 'POLICY_CHANGE', 'BULK_ENROLLMENT', 'RESTAURANT_CLOSURE'] },
  payload: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  notes: String,
  resolvedAt: Date,
}, { timestamps: true });

export const ApprovalRequest = mongoose.model<IApprovalRequest>('ApprovalRequest', approvalSchema);

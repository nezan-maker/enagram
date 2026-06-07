import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  restaurantId: Types.ObjectId;
  submittedBy: Types.ObjectId;
  type: 'FINANCIAL' | 'HR' | 'OPERATIONAL' | 'INVENTORY';
  period: { from: Date; to: Date };
  data: Record<string, unknown>;
  summary: string;
  isCritical: boolean;
  viewedByOwner: boolean;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['FINANCIAL', 'HR', 'OPERATIONAL', 'INVENTORY'], required: true },
  period: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  data: { type: Schema.Types.Mixed, required: true },
  summary: { type: String, required: true },
  isCritical: { type: Boolean, default: false },
  viewedByOwner: { type: Boolean, default: false },
}, { timestamps: true });

export const Report = mongoose.model<IReport>('Report', reportSchema);

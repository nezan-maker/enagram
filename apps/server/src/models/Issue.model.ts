import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IIssue extends Document {
  restaurantId?: Types.ObjectId;
  raisedBy: Types.ObjectId;
  channel: 'CLIENT' | 'STAFF';
  category: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: Types.ObjectId;
  resolution?: string;
  comments: IIssueComment[];
  createdAt: Date;
  updatedAt: Date;
}

interface IIssueComment {
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const issueCommentSchema = new Schema<IIssueComment>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const issueSchema = new Schema<IIssue>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, enum: ['CLIENT', 'STAFF'], required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolution: String,
  comments: [issueCommentSchema],
}, { timestamps: true });

issueSchema.index({ restaurantId: 1, status: 1 });
issueSchema.index({ raisedBy: 1 });

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);

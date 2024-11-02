import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  accessSection: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operator'], default: 'operator' },
  createdAt: { type: Date, default: Date.now },
});

export interface IUser extends User, Document {}
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
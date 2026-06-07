import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { User, IUser } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateTokens } from '../utils/generateTokens.js';
import { env } from '../config/env.js';

const encoder = new TextEncoder();

interface AuthResult {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
  firstLogin?: boolean;
}

export const register = async (email: string, password: string, firstName: string, lastName: string, role: string): Promise<AuthResult> => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email, password: hashedPassword, role, firstName, lastName,
    isPasswordSet: true, isActive: true,
  });

  const tokens = await generateTokens(user._id.toString(), user.role);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

  return { user: user.toObject(), ...tokens };
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');
  if (!user.isPasswordSet || !user.password) throw new ApiError(401, 'Password not set — staff must login with staffId');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const tokens = await generateTokens(user._id.toString(), user.role);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

  return { user: user.toObject(), ...tokens };
};

export const staffLogin = async (staffId: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ staffId });
  if (!user) throw new ApiError(401, 'Invalid staff ID');
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');

  if (!user.isPasswordSet) {
    // First login — set password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.isPasswordSet = true;
    const tokens = await generateTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return { user: user.toObject(), ...tokens, firstLogin: true };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const tokens = await generateTokens(user._id.toString(), user.role);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

  return { user: user.toObject(), ...tokens };
};

export const refreshAuth = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  let payload: { _id?: string };
  try {
    const secret = encoder.encode(env.JWT_REFRESH_SECRET);
    const result = await jwtVerify(refreshToken, secret);
    payload = result.payload as { _id?: string };
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(payload._id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Refresh token revoked');
  }

  const tokens = await generateTokens(user._id.toString(), user.role);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: tokens.refreshToken } });

  return tokens;
};

export const logout = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

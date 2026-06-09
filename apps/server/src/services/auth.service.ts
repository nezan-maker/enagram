import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateTokens } from '../utils/generateTokens.js';
import { env } from '../config/env.js';

const encoder = new TextEncoder();

const REFRESH_TOKEN_HASH_ROUNDS = 10;

interface AuthResult {
  user: Record<string, unknown>;
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
  const hashedRefresh = await bcrypt.hash(tokens.refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: hashedRefresh } });

  return { user: user.toObject() as unknown as Record<string, unknown>, ...tokens };
};

export const login = async (email: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');
  if (!user.isPasswordSet || !user.password) throw new ApiError(401, 'Password not set — staff must login with staffId');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const tokens = await generateTokens(user._id.toString(), user.role, user.restaurantId?.toString());
  const hashedRefresh = await bcrypt.hash(tokens.refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: hashedRefresh } });

  return { user: user.toObject() as unknown as Record<string, unknown>, ...tokens };
};

export const staffLogin = async (staffId: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ staffId });
  if (!user) throw new ApiError(401, 'Invalid staff ID');
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');

  if (!user.isPasswordSet) {
    // First login — set password. Enforce strong password.
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      throw new ApiError(400, 'Password must be at least 8 characters with uppercase, number, and special character');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.isPasswordSet = true;
    const tokens = await generateTokens(user._id.toString(), user.role, user.restaurantId?.toString());
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
    user.refreshToken = hashedRefresh;
    await user.save();
    return { user: user.toObject() as unknown as Record<string, unknown>, ...tokens, firstLogin: true };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const tokens = await generateTokens(user._id.toString(), user.role, user.restaurantId?.toString());
  const hashedRefresh = await bcrypt.hash(tokens.refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: hashedRefresh } });

  return { user: user.toObject() as unknown as Record<string, unknown>, ...tokens };
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
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Refresh token revoked');
  }

  // Constant-time bcrypt comparison instead of plaintext string equality
  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isValid) {
    throw new ApiError(401, 'Refresh token revoked');
  }

  const tokens = await generateTokens(user._id.toString(), user.role, user.restaurantId?.toString());
  const hashedRefresh = await bcrypt.hash(tokens.refreshToken, REFRESH_TOKEN_HASH_ROUNDS);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: hashedRefresh } });

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

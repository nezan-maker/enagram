import { SignJWT } from 'jose';
import { env } from '../config/env.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const encoder = new TextEncoder();

export const generateTokens = async (userId: string, role: string): Promise<TokenPair> => {
  const accessSecret = encoder.encode(env.JWT_ACCESS_SECRET);
  const refreshSecret = encoder.encode(env.JWT_REFRESH_SECRET);

  const accessToken = await new SignJWT({ _id: userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(env.JWT_ACCESS_EXPIRY)
    .sign(accessSecret);

  const refreshToken = await new SignJWT({ _id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(env.JWT_REFRESH_EXPIRY)
    .sign(refreshSecret);

  return { accessToken, refreshToken };
};

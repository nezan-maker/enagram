import * as uuid from "uuid";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
interface JwtPayload {
  user_id: string;
}
export const build_id = (): string => {
  const id: string = crypto.randomBytes(12).toString("hex");
  return id;
};
export const generate_token = (): string => {
  const token: string = crypto.randomInt(1000000).toString().padStart(6, "0");
  return token;
};
export const auth_jwt_token = (object: JwtPayload): string => {
  if (!env.ACCESS_SECRET) {
    throw new Error("Could not load environment variable");
  }
  const token: string = jwt.sign(object, env.ACCESS_SECRET, {
    expiresIn: "10m",
  });
  return token;
};

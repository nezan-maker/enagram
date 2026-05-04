import type { Request, Response } from "express";
import User from "../models/User.js";
import debug from "debug";
import {
  signup_schema,
  login_schema,
  confirm_schema,
} from "../validations/auth_validations.js";
import {
  build_id,
  generate_token,
  auth_jwt_token,
} from "../utils/build_utils.js";

export const sign_up = async (req: Request, res: Response) => {
  const sign_log = debug("app:controller:signup");
  try {
    const { signup_payload } = req.body;
    const sign_up_body = signup_schema.parse(signup_payload);
    const old_user = await User.findOne({
      user_email: sign_up_body.user_email,
      role: sign_up_body.role,
    });
    if (old_user) {
      sign_log("Could not create new account.Duplicate detected");
      return res.status(401).json({
        duplicate_error: "Account already created.Consider signing in",
      });
    }
    const otp_token = generate_token();

    const user = new User(sign_up_body);
    user.sign_otp_token = otp_token;
    const user_object = { user_id: user._id };
    const access_token = auth_jwt_token(user_object);
    res.cookie("access_token", access_token, {
      maxAge: 10 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    await user.save();
    res.status(201).json({ success: "Successfully created account" });
    sign_log(`${sign_up_body.role} successfully created account`);
  } catch (error) {
    console.error(error);
    sign_log("Could not finish registering user");
    return res.status(500).json({ server_error: "Internal server error" });
  }
};
export const log_in = async (req: Request, res: Response) => {};
export const confirm = async (req: Request, res: Response) => {};
export const confirm_get = async (req: Request, res: Response) => {};
export const forgot = async (req: Request, res: Response) => {};
export const verify = async (req: Request, res: Response) => {};
export const reset = async (req: Request, res: Response) => {};

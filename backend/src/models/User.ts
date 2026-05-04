import mongoose from "mongoose";
import { build_id } from "../utils/build_utils.js";
const user_schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: "user_" + build_id(),
  },
  user_name: {
    type: String,
    required: true,
    index: true,
  },
  user_email: {
    type: String,
    required: true,
    index: true,
  },
  user_pass: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  sign_otp_token: {
    type: String,
    default: null,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  resto_location: {
    type: String,
  },
  user_pass_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    index: true,
  },
});

user_schema.index({ user_name: 1, user_email: 1, role: 1 });
const User = mongoose.model("user", user_schema);
export default User;

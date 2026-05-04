import mongoose from "mongoose";
const user_schema = new mongoose.Schema({
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
  user_password: {
    type: String,
    required: true,
  },
  user_otp_token: {
    type: String,
    default: null,
  },
  is_verified: {
    type: Boolean,
    default: false,
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

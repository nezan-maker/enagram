import z from "zod";
const sign_reg_exp = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
);
export const signup_schema = z.object({
  user_name: z.string(),
  user_email: z.email(),
  phone: z.string().regex(/^[0-9]{10}$/),
  user_pass: z.string(),
  resto_name: z.string().optional(),
  resto_location: z.string().optional(),
  employee_id: z.string().optional(),
  role: z.enum(["Owner", "Client", "Chef", "Waiter"]),
});
export const login_schema = z.object({
  user_email: z.string(),
  user_password: z.string().regex(sign_reg_exp),
});
export const confirm_schema = z.object({
  token: z.string().regex(/^[0-9]{6}$/),
});

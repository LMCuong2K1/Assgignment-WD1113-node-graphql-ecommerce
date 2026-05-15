const { z } = require("zod");
const emailInputSchema = z.string().email("Email không đúng định dạng!");
const passwordInputSchema = z
  .string()
  .min(6, "Password tối thiểu 6 ký tự");
module.exports = {
  registerSchema: z.object({
    body: z.object({
      name: z.string({ required_error: "Tên không được để trống" }),
      email: emailInputSchema,
      password: passwordInputSchema,
    }),
  }),
  loginSchema: z.object({
    body: z.object({
      email: emailInputSchema,
      password: passwordInputSchema,
    }),
  }),
  updateUserProfileSchema: z.object({
    body: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
  updateUserByAdminSchema: z.object({
    body: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      email: emailInputSchema.optional(),
      password: passwordInputSchema.optional(),
      role: z.enum(["user", "admin"]).optional(),
    }),
  }),
};

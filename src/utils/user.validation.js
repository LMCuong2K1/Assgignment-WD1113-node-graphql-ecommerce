const { z } = require("zod");
module.exports = {
  registerSchema: z.object({
    name: z.string({ required_error: "Tên không được để trống" }),
    email: z.string().email({ required_error: "Email không đúng định dạng!" }),
    password: z
      .string()
      .min(6, { required_error: "Password tối thiểu 6 ký tự" }),
  }),
  loginSchema: z.object({
    email: z.string().email({ required_error: "Email không đúng định dạng!" }),
    password: z
      .string()
      .min(6, { required_error: "Password tối thiểu 6 ký tự" }),
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
      role: z.enum(["user", "admin"]).optional(),
    }),
  }),
};

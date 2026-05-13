const { z } = require("zod");
const { objectIdSchema } = require("./validators");
const shippingAddressInputSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(1, { message: "Địa chỉ không được để trống!" }),
});
const orderStatusInputSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered"], {
    required_error: "Trạng thái không được để trống!",
    invalid_type_error: "Trạng thái không hợp lệ!",
  }),
});
module.exports = {
  shippingAddressInputSchema,
  orderStatusInputSchema,
  // POST /api/orders — tạo đơn hàng từ giỏ
  createOrderSchema: z.object({
    body: shippingAddressInputSchema,
  }),
  // GET /api/orders/:id
  getOrderByIdSchema: z.object({
    params: z.object({ id: objectIdSchema }),
  }),
  // PUT /api/orders/:id/status (admin)
  updateOrderStatusSchema: z.object({
    params: z.object({ id: objectIdSchema }),
    body: orderStatusInputSchema,
  }),
};

const { z } = require("zod");
const { objectIdSchema } = require("./validators");

module.exports = {
  // POST /api/orders — tạo đơn hàng từ giỏ
  createOrderSchema: z.object({
    body: z.object({
      shippingAddress: z
        .string({ required_error: "Địa chỉ giao hàng không được để trống!" })
        .trim()
        .min(1, { message: "Địa chỉ giao hàng không được để trống!" }),
    }),
  }),
  // GET /api/orders/:id
  getOrderByIdSchema: z.object({
    params: z.object({ id: objectIdSchema }),
  }),
  // PUT /api/orders/:id/status (admin)
  updateOrderStatusSchema: z.object({
    params: z.object({ id: objectIdSchema }),
    body: z.object({
      status: z.enum(["pending", "processing", "shipped", "delivered"], {
        required_error: "Trạng thái không được để trống!",
        invalid_type_error:
          "Trạng thái phải là: pending, processing, shipped, delivered",
      }),
    }),
  }),
};

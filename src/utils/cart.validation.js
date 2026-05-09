const { z } = require("zod");
const { objectIdSchema } = require("./validators");

module.exports = {
  // POST /api/cart/add
  addToCartSchema: z.object({
    body: z.object({
      productId: objectIdSchema,
      quantity: z
        .number({ required_error: "Số lượng không được để trống!" })
        .int({ message: "Số lượng phải là số nguyên!" })
        .min(1, { message: "Số lượng tối thiểu là 1!" }),
    }),
  }),
  // PUT /api/cart/update
  updateCartItemSchema: z.object({
    body: z.object({
      productId: objectIdSchema,
      quantity: z
        .number({ required_error: "Số lượng không được để trống!" })
        .int({ message: "Số lượng phải là số nguyên!" })
        .min(1, { message: "Số lượng tối thiểu là 1!" }),
    }),
  }),
  // DELETE /api/cart/remove/:productId
  removeFromCartSchema: z.object({
    params: z.object({
      productId: objectIdSchema,
    }),
  }),
};

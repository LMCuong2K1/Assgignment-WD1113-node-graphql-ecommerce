const { z } = require("zod");
const { objectIdSchema } = require("./validators");

const cartItemInputSchema = z.object({
  productId: objectIdSchema,
  quantity: z
    .number({ required_error: "Số lượng không được để trống!" })
    .int({ message: "Số lượng phải là số nguyên!" })
    .min(1, { message: "Số lượng tối thiểu là 1!" }),
});

module.exports = {
  cartItemInputSchema,
  // POST /api/cart/add
  addToCartSchema: z.object({ body: cartItemInputSchema }),
  // PUT /api/cart/update
  updateCartItemSchema: z.object({ body: cartItemInputSchema }),
  // DELETE /api/cart/remove/:productId
  removeFromCartSchema: z.object({
    params: z.object({
      productId: objectIdSchema,
    }),
  }),
};

const express = require("express");
const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} = require("../utils/cart.validation");

const router = express.Router();

// Tất cả route Cart đều yêu cầu đăng nhập
router.use(protect);

router.get("/", cartController.getCart);
router.post("/add", validate(addToCartSchema), cartController.addToCart);
router.put("/update", validate(updateCartItemSchema), cartController.updateCartItem);
router.delete("/remove/:productId", validate(removeFromCartSchema), cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;

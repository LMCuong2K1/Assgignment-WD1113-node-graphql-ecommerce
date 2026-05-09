const express = require("express");
const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  createOrderSchema,
  getOrderByIdSchema,
  updateOrderStatusSchema,
} = require("../utils/order.validation");

const router = express.Router();

// Tất cả route Order đều yêu cầu đăng nhập
router.use(protect);

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getOrders);

// Admin: lấy tất cả đơn hàng (phải đặt TRƯỚC /:id để tránh conflict)
router.get("/all", admin, orderController.getAllOrders);

router.get("/:id", validate(getOrderByIdSchema), orderController.getOrderById);
router.put("/:id/status", admin, validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;

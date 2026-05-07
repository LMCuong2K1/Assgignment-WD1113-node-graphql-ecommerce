const express = require("express");
const {
  registerSchema,
  loginSchema,
  updateUserProfileSchema,
  updateUserByAdminSchema,
} = require("../utils/user.validation");
const validate = require("../middlewares/validate");
const AuthController = require("../controllers/authController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/profile", protect, AuthController.getProfile);
router.patch(
  "/profile",
  protect,
  validate(updateUserProfileSchema),
  AuthController.updateProfile,
);

// Dành cho Admin: Lấy danh sách tất cả người dùng
router.get("/users", protect, admin, AuthController.getAllUsers);

// Dành cho Admin: Sửa tài khoản của người dùng bất kỳ (VD: đổi role)
router.patch(
  "/users/:id",
  protect,
  admin,
  validate(updateUserByAdminSchema),
  AuthController.updateUserByAdmin
);

module.exports = router;

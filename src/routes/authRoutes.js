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
router.get("/users", protect, admin, AuthController.getAllUsers);
router.get("/profile", protect, AuthController.getProfile);
router.patch(
  "/profile",
  protect,
  validate(updateUserProfileSchema),
  AuthController.updateProfile,
);
router.patch(
  "/users/:id",
  protect,
  admin,
  validate(updateUserByAdminSchema),
  AuthController.updateUserByAdmin,
);

module.exports = router;

const express = require("express");
const categoryController = require("../controllers/categoryController");
const { protect, admin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { objectIdSchema } = require("../utils/validators");
const {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategoryByIdSchema,
} = require("../utils/category.validation");
const router = express.Router();

router.get("/", categoryController.getCategories);
router.get(
  "/:id",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryById,
);

router.post(
  "/",
  protect,
  admin,
  validate(createCategorySchema),
  categoryController.createCategory,
);
router.put(
  "/:id",
  protect,
  admin,
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  protect,
  admin,
  validate(deleteCategorySchema),
  categoryController.deleteCategory,
);

module.exports = router;

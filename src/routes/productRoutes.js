const express = require("express");
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const { admin, protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
    createProductSchema,
    updateProductSchema,
    deleteProductSchema,
    getProductByIdSchema,
} = require("../utils/product.validation");
const {
    createReviewSchema,
    getProductReviewsSchema,
    deleteReviewSchema,
} = require("../utils/review.validation");
const router = express.Router();

// ── Product CRUD ──
router.post("/", protect, admin, validate(createProductSchema), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", validate(getProductByIdSchema), productController.getProductById);
router.put("/:id", protect, admin, validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", protect, admin, validate(deleteProductSchema), productController.deleteProduct);

// ── Review & Rating ──
router.post("/:id/reviews", protect, validate(createReviewSchema), reviewController.createReview);
router.get("/:id/reviews", validate(getProductReviewsSchema), reviewController.getProductReviews);
router.delete("/:id/reviews/:reviewId", protect, validate(deleteReviewSchema), reviewController.deleteReview);

module.exports = router;
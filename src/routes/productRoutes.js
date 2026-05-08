const express = require("express");
const productController = require("../controllers/productController");
const { admin, protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
    createProductSchema,
    updateProductSchema,
    deleteProductSchema,
    getProductByIdSchema,
} = require("../utils/product.validation");
const router = express.Router();


router.post("/", protect, admin, validate(createProductSchema), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", validate(getProductByIdSchema), productController.getProductById);
router.put("/:id", protect, admin, validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", protect, admin, validate(deleteProductSchema), productController.deleteProduct);
module.exports = router;
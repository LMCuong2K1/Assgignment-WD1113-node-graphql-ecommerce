const catchAsync = require("../utils/catchAsync");
const productService = require("../services/productService");

class ProductController {
  createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({
      success: true,
      data: product,
    });
  });

  getProducts = catchAsync(async (req, res) => {
    const { products, count } = await productService.findAllProducts(req.query);
    return res.status(200).json({
      success: true,
      count,
      data: products,
    });
  });

  getProductById = catchAsync(async (req, res) => {
    const product = await productService.findProductById(req.params.id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  });

  updateProduct = catchAsync(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      data: product,
    });
  });

  deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  });
}

module.exports = new ProductController();

const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const productService = require("../services/productService");

class ProductController {
  createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    success(res, { data: product, statusCode: 201 });
  });

  getProducts = catchAsync(async (req, res) => {
    const { products, count, totalPages, page, limit } = await productService.findAllProducts(req.query);
    success(res, { data: products, count, totalPages, page, limit });
  });

  getProductById = catchAsync(async (req, res) => {
    const product = await productService.findProductById(req.params.id);
    success(res, { data: product });
  });

  updateProduct = catchAsync(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    success(res, { data: product });
  });

  deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    success(res, { message: "Xóa sản phẩm thành công" });
  });
}

module.exports = new ProductController();

const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const CategoryService = require("../services/categoryService");

class CategoryController {
  createCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.createCategory(req.body);
    success(res, { data: result, message: "Đã tạo danh mục thành công", statusCode: 201 });
  });

  updateCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
    success(res, { data: result, message: "Đã cập nhật danh mục thành công" });
  });

  getCategories = catchAsync(async (req, res) => {
    const result = await CategoryService.getCategories();
    success(res, { data: result, message: "Đã lấy danh mục thành công" });
  });

  getCategoryById = catchAsync(async (req, res) => {
    const result = await CategoryService.getCategoryById(req.params.id);
    success(res, { data: result, message: "Đã lấy danh mục thành công" });
  });

  deleteCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.deleteCategory(req.params.id);
    success(res, { data: result, message: "Đã xóa danh mục thành công" });
  });
}

module.exports = new CategoryController();

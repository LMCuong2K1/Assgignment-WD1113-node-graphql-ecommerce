const catchAsync = require("../utils/catchAsync");
const CategoryService = require("../services/categoryService");

class CategoryController {
  createCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Đã tạo danh mục thành công",
      data: result,
    });
  });

  updateCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Đã cập nhật danh mục thành công",
      data: result,
    });
  });

  getCategories = catchAsync(async (req, res) => {
    const result = await CategoryService.getCategories();
    return res.status(200).json({
      success: true,
      message: "Đã lấy danh mục thành công",
      data: result,
    });
  });

  getCategoryById = catchAsync(async (req, res) => {
    const result = await CategoryService.getCategoryById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Đã lấy danh mục thành công",
      data: result,
    });
  });

  deleteCategory = catchAsync(async (req, res) => {
    const result = await CategoryService.deleteCategory(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Đã xóa danh mục thành công",
      data: result,
    });
  });
}

module.exports = new CategoryController();

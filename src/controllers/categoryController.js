const CategoryService = require("../services/categoryService");
class CategoryController {
  createCategory = async (req, res) => {
    try {
      const result = await CategoryService.createCategory(req.body);
      return res.status(201).json({
        success: true,
        message: "Đã tạo danh mục thành công",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  updateCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const result = await CategoryService.updateCategory(id, updateData);
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật danh mục thành công",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  getCategories = async (req, res) => {
    try {
      const result = await CategoryService.getCategories();
      return res.status(200).json({
        success: true,
        message: "Đã lấy danh mục thành công",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  getCategoryById = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CategoryService.getCategoryById(id);
      return res.status(200).json({
        success: true,
        message: "Đã lấy danh mục thành công",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CategoryService.deleteCategory(id);
      return res.status(200).json({
        success: true,
        message: "Đã xóa danh mục thành công",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
}

module.exports = new CategoryController();

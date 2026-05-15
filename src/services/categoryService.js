const Category = require("../models/Category");
const AppError = require("../utils/AppError");
class CategoryService {
  createCategory = async (createData) => {
    if (await Category.findOne({ name: createData.name }))
      throw new AppError("Danh mục đã tồn tại!",409);
    const category = await Category.create(createData);
    if (createData.parent) {
      await Category.findByIdAndUpdate(createData.parent, {
        $push: { children: category._id },
      });
    }
    return category;
  };

  updateCategory = async (id, updateData) => {
    if (updateData.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
      });
      if (existingCategory && existingCategory._id.toString() !== id)
        throw new AppError("Tên danh mục đã tồn tại!",409);
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!category) throw new AppError("Không tìm thấy danh mục!",404);
    return category;
  };
  deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Không tìm thấy danh mục!",404);
    }
    return await category.updateOne({ isActive: false });
  };
  getCategoryById = async (id, selectFields = "") => {
    const category = await Category.findOne({ _id: id, isActive: true })
      .select(selectFields)
      .populate('parent', 'name')
      .populate('children', 'name')
      .lean();
    if (!category) {
      throw new AppError("Không tìm thấy danh mục!",404);
    }
    return category;
  };
  getCategories = async (selectFields = "") => {
    return await Category.find({ isActive: true })
      .select(selectFields)
      .sort({ createdAt: -1 })
      .populate('parent', 'name')
      .populate('children', 'name')
      .lean();
  };
}
module.exports = new CategoryService();

const Category = require("../models/Category");

class CategoryService {
  createCategory = async (createData) => {
    if (await Category.findOne({ name: createData.name }))
      throw new Error("Danh mục đã tồn tại!");
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
        throw new Error("Tên danh mục đã tồn tại!");
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new Error("Không tìm thấy danh mục!");
    return category;
  };
  deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Không tìm thấy danh mục!");
    }
    return await category.updateOne({ isActive: false });
  };
  getCategoryById = async (id) => {
    const category = await Category.findOne({ _id: id, isActive: true });
    if (!category) {
      throw new Error("Không tìm thấy danh mục!");
    }
    return category;
  };
  getCategories = async () => {
    return Category.find({ isActive: true }).lean();
  };
}
module.exports = new CategoryService();

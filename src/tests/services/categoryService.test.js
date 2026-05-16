jest.mock('../../models/Category', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
}));

const Category = require('../../models/Category');
const AppError = require('../../utils/AppError');

describe('categoryService', () => {
  let categoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    categoryService = require('../../services/categoryService');
  });

  describe('createCategory', () => {
    it('should create category without parent', async () => {
      const createData = { name: 'Electronics' };
      const mockCategory = { _id: 'cat1', name: 'Electronics' };
      Category.findOne.mockResolvedValue(null);
      Category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory(createData);

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'Electronics' });
      expect(Category.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockCategory);
    });

    it('should create category and add to parent children', async () => {
      const createData = { name: 'Phones', parent: 'parent1' };
      const mockCategory = { _id: 'cat2', name: 'Phones', parent: 'parent1' };
      Category.findOne.mockResolvedValue(null);
      Category.create.mockResolvedValue(mockCategory);
      Category.findByIdAndUpdate.mockResolvedValue({});

      await categoryService.createCategory(createData);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith('parent1', {
        $push: { children: 'cat2' },
      });
    });

    it('should throw 409 if category name exists', async () => {
      Category.findOne.mockResolvedValue({ name: 'Electronics' });

      await expect(categoryService.createCategory({ name: 'Electronics' }))
        .rejects.toThrow('Danh mục đã tồn tại!');
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const mockCategory = { _id: 'cat1', name: 'Updated' };
      Category.findOne.mockResolvedValue(null);
      Category.findByIdAndUpdate.mockResolvedValue(mockCategory);

      const result = await categoryService.updateCategory('cat1', { name: 'Updated' });

      expect(result).toEqual(mockCategory);
    });

    it('should update category without checking name if name not in updateData', async () => {
      const mockCategory = { _id: 'cat1', name: 'Original' };
      Category.findByIdAndUpdate.mockResolvedValue(mockCategory);

      const result = await categoryService.updateCategory('cat1', { description: 'New desc' });

      expect(Category.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should throw 409 if new name already exists for another category', async () => {
      Category.findOne.mockResolvedValue({ _id: 'other', name: 'Existing' });
      Category.findByIdAndUpdate.mockResolvedValue(null);

      await expect(categoryService.updateCategory('cat1', { name: 'Existing' }))
        .rejects.toThrow('Tên danh mục đã tồn tại!');
    });

    it('should throw 404 if category not found', async () => {
      Category.findOne.mockResolvedValue(null);
      Category.findByIdAndUpdate.mockResolvedValue(null);

      await expect(categoryService.updateCategory('invalid-id', { name: 'Test' }))
        .rejects.toThrow('Không tìm thấy danh mục!');
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete category', async () => {
      const mockCategory = {
        _id: 'cat1',
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      Category.findById.mockResolvedValue(mockCategory);

      await categoryService.deleteCategory('cat1');

      expect(mockCategory.updateOne).toHaveBeenCalledWith({ isActive: false });
    });

    it('should throw 404 if category not found', async () => {
      Category.findById.mockResolvedValue(null);

      await expect(categoryService.deleteCategory('invalid-id'))
        .rejects.toThrow('Không tìm thấy danh mục!');
    });
  });

  describe('getCategoryById', () => {
    it('should return category with populated parent and children', async () => {
      const mockCategory = { _id: 'cat1', name: 'Electronics' };
      Category.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCategory),
      });

      const result = await categoryService.getCategoryById('cat1');

      expect(result).toEqual(mockCategory);
    });

    it('should throw 404 if category not found or inactive', async () => {
      Category.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(categoryService.getCategoryById('invalid-id'))
        .rejects.toThrow('Không tìm thấy danh mục!');
    });
  });

  describe('getCategories', () => {
    it('should return all active categories', async () => {
      const mockCategories = [
        { _id: 'cat1', name: 'Electronics' },
        { _id: 'cat2', name: 'Clothing' },
      ];
      Category.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCategories),
      });

      const result = await categoryService.getCategories();

      expect(result).toEqual(mockCategories);
    });

    it('should return empty array if no categories', async () => {
      Category.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });

      const result = await categoryService.getCategories();

      expect(result).toEqual([]);
    });
  });
});

const categoryResolver = require('../../graphql/resolvers/categoryResolver');
const categoryService = require('../../services/categoryService');

jest.mock('../../services/categoryService');
jest.mock('graphql-fields', () => jest.fn(() => ({})));

describe('categoryResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [{ _id: '1', name: 'Cat1' }];
      categoryService.getCategories.mockResolvedValue(mockCategories);

      const result = await categoryResolver.Query.categories({}, {}, {}, {});

      expect(result).toEqual(mockCategories);
    });
  });

  describe('Query.category', () => {
    it('should return category by id', async () => {
      const mockCategory = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Cat1' };
      categoryService.getCategoryById.mockResolvedValue(mockCategory);

      const result = await categoryResolver.Query.category(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e' },
        {},
        {}
      );

      expect(result).toEqual(mockCategory);
    });
  });

  describe('Mutation.createCategory', () => {
    it('should create category when admin', async () => {
      const mockCategory = { _id: '1', name: 'New Cat' };
      categoryService.createCategory.mockResolvedValue(mockCategory);
      const context = { user: { role: 'admin' } };

      const result = await categoryResolver.Mutation.createCategory(
        {},
        { input: { name: 'New Cat' } },
        context
      );

      expect(result).toEqual(mockCategory);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        categoryResolver.Mutation.createCategory({}, { input: {} }, context)
      ).rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });

  describe('Mutation.updateCategory', () => {
    it('should update category when admin', async () => {
      const mockCategory = { _id: '1', name: 'Updated' };
      categoryService.updateCategory.mockResolvedValue(mockCategory);
      const context = { user: { role: 'admin' } };

      const result = await categoryResolver.Mutation.updateCategory(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e', input: { name: 'Updated' } },
        context
      );

      expect(result).toEqual(mockCategory);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        categoryResolver.Mutation.updateCategory({}, { id: '1', input: {} }, context)
      ).rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });

  describe('Mutation.deleteCategory', () => {
    it('should delete category when admin', async () => {
      categoryService.deleteCategory.mockResolvedValue(undefined);
      const context = { user: { role: 'admin' } };

      const result = await categoryResolver.Mutation.deleteCategory(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e' },
        context
      );

      expect(result).toBe(true);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        categoryResolver.Mutation.deleteCategory({}, { id: '1' }, context)
      ).rejects.toThrow('Bạn không có quyền thực hiện chức năng này!');
    });
  });
});

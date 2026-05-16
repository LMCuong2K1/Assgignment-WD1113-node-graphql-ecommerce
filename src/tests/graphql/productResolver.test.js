const productResolver = require('../../graphql/resolvers/productResolver');
const productService = require('../../services/productService');

jest.mock('../../services/productService');
jest.mock('graphql-fields', () => jest.fn(() => ({})));

describe('productResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.products', () => {
    it('should return all products', async () => {
      const mockResult = { products: [], count: 0, totalPages: 0, page: 1, limit: 10 };
      productService.findAllProducts.mockResolvedValue(mockResult);

      const result = await productResolver.Query.products({}, { pagination: {} }, {}, {});

      expect(result).toEqual(mockResult);
      expect(productService.findAllProducts).toHaveBeenCalledWith({}, '');
    });

    it('should pass pagination args to service', async () => {
      const mockResult = { products: [], count: 0, totalPages: 0, page: 1, limit: 10 };
      productService.findAllProducts.mockResolvedValue(mockResult);

      await productResolver.Query.products({}, { pagination: { page: 2, limit: 5 } }, {}, {});

      expect(productService.findAllProducts).toHaveBeenCalledWith({ page: 2, limit: 5 }, '');
    });
  });

  describe('Query.product', () => {
    it('should return product by id', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1' };
      productService.findProductById.mockResolvedValue(mockProduct);

      const result = await productResolver.Query.product({}, { id: '665a1b2c3d4e5f6a7b8c9d0e' }, {}, {});

      expect(result).toEqual(mockProduct);
      expect(productService.findProductById).toHaveBeenCalledWith('665a1b2c3d4e5f6a7b8c9d0e', '');
    });
  });

  describe('Mutation.createProduct', () => {
    it('should create product when admin', async () => {
      const mockProduct = { _id: '1', name: 'New Product' };
      productService.createProduct.mockResolvedValue(mockProduct);
      const context = { user: { role: 'admin' } };

      const result = await productResolver.Mutation.createProduct(
        {},
        { input: { name: 'New Product', price: 100, stock: 10, category: '665a1b2c3d4e5f6a7b8c9d0e', description: 'Desc', sku: 'SKU1', images: [{ url: 'http://test.com' }] } },
        context
      );

      expect(result).toEqual(mockProduct);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        productResolver.Mutation.createProduct({}, { input: {} }, context)
      ).rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });

    it('should throw error when no user', async () => {
      const context = { user: null };

      await expect(
        productResolver.Mutation.createProduct({}, { input: {} }, context)
      ).rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });
  });

  describe('Mutation.updateProduct', () => {
    it('should update product when admin', async () => {
      const mockProduct = { _id: '1', name: 'Updated' };
      productService.updateProduct.mockResolvedValue(mockProduct);
      const context = { user: { role: 'admin' } };

      const result = await productResolver.Mutation.updateProduct(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e', input: { name: 'Updated' } },
        context
      );

      expect(result).toEqual(mockProduct);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        productResolver.Mutation.updateProduct({}, { id: '1', input: {} }, context)
      ).rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });
  });

  describe('Mutation.deleteProduct', () => {
    it('should delete product when admin', async () => {
      productService.deleteProduct.mockResolvedValue(undefined);
      const context = { user: { role: 'admin' } };

      const result = await productResolver.Mutation.deleteProduct(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e' },
        context
      );

      expect(result).toBe(true);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        productResolver.Mutation.deleteProduct({}, { id: '1' }, context)
      ).rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });
  });
});

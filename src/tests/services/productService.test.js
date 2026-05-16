const productService = require('../../services/productService');
const Product = require('../../models/Product');
const AppError = require('../../utils/AppError');

jest.mock('../../models/Product');

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create product and populate category', async () => {
      const body = { name: 'Product 1', price: 100, category: 'cat1' };
      const mockProduct = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        ...body,
        populate: jest.fn().mockResolvedValue({ _id: '665a1b2c3d4e5f6a7b8c9d0e', ...body, category: { name: 'Cat1' } }),
      };
      Product.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(body);

      expect(Product.create).toHaveBeenCalledWith(body);
      expect(mockProduct.populate).toHaveBeenCalledWith('category', 'name');
    });
  });

  describe('findAllProducts', () => {
    it('should return products with default pagination', async () => {
      const mockProducts = [{ _id: '1', name: 'Product 1' }];
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts),
      });
      Product.countDocuments.mockResolvedValue(1);

      const result = await productService.findAllProducts({});

      expect(result.products).toEqual(mockProducts);
      expect(result.count).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter by category', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ category: 'cat1' });

      expect(Product.find).toHaveBeenCalledWith({ isActive: true, category: 'cat1' });
    });

    it('should filter by price range', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ minPrice: 50, maxPrice: 200 });

      expect(Product.find).toHaveBeenCalledWith({
        isActive: true,
        price: { $gte: 50, $lte: 200 },
      });
    });

    it('should filter by minPrice only', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ minPrice: 50 });

      expect(Product.find).toHaveBeenCalledWith({
        isActive: true,
        price: { $gte: 50 },
      });
    });

    it('should filter by maxPrice only', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ maxPrice: 200 });

      expect(Product.find).toHaveBeenCalledWith({
        isActive: true,
        price: { $lte: 200 },
      });
    });

    it('should filter by search term with regex', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ search: 'phone' });

      expect(Product.find).toHaveBeenCalledWith({
        isActive: true,
        name: { $regex: 'phone', $options: 'i' },
      });
    });

    it('should ignore invalid sort parameter', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      await productService.findAllProducts({ sort: 'invalid' });

      expect(Product.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('should calculate pagination correctly', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(25);

      const result = await productService.findAllProducts({ page: 2, limit: 10 });

      expect(result.totalPages).toBe(3);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });
  });

  describe('findProductById', () => {
    it('should return product if found and active', async () => {
      const mockProduct = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Product 1',
        isActive: true,
        populate: jest.fn().mockResolvedValue({ _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1' }),
      };
      Product.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockProduct) });

      const result = await productService.findProductById('665a1b2c3d4e5f6a7b8c9d0e');

      expect(Product.findOne).toHaveBeenCalledWith({ _id: '665a1b2c3d4e5f6a7b8c9d0e', isActive: true });
    });

    it('should throw 404 if product not found', async () => {
      Product.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(productService.findProductById('invalid-id'))
        .rejects.toThrow('Product is not exist!');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const mockProduct = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Old Name',
        save: jest.fn().mockResolvedValue({
          _id: '665a1b2c3d4e5f6a7b8c9d0e',
          name: 'New Name',
          populate: jest.fn().mockResolvedValue({ name: 'New Name' }),
        }),
      };
      Product.findOne
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(null);

      await productService.updateProduct('665a1b2c3d4e5f6a7b8c9d0e', { name: 'New Name' });

      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should throw 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(productService.updateProduct('invalid-id', { name: 'Test' }))
        .rejects.toThrow('Product is not exist!');
    });

    it('should throw 409 if duplicate name exists', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Old' };
      Product.findOne
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ _id: 'other', name: 'New Name' });

      await expect(productService.updateProduct('665a1b2c3d4e5f6a7b8c9d0e', { name: 'New Name' }))
        .rejects.toThrow('Name or SKU is already exists!');
    });

    it('should throw 409 if duplicate SKU exists', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', sku: 'OLD-SKU' };
      Product.findOne
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ _id: 'other', sku: 'NEW-SKU' });

      await expect(productService.updateProduct('665a1b2c3d4e5f6a7b8c9d0e', { sku: 'NEW-SKU' }))
        .rejects.toThrow('Name or SKU is already exists!');
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product', async () => {
      const mockProduct = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        isActive: true,
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      Product.findOne.mockResolvedValue(mockProduct);

      await productService.deleteProduct('665a1b2c3d4e5f6a7b8c9d0e');

      expect(mockProduct.updateOne).toHaveBeenCalledWith({ isActive: false });
    });

    it('should throw 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(productService.deleteProduct('invalid-id'))
        .rejects.toThrow('Không tìm thấy Product!');
    });
  });
});

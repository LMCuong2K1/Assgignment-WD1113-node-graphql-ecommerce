const request = require('supertest');
const app = require('../../app');

jest.mock('../../models/Product');
jest.mock('../../models/User');

const Product = require('../../models/Product');
const User = require('../../models/User');

describe('Product Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100, category: { name: 'Cat1' } },
      ];
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts),
      });
      Product.countDocuments.mockResolvedValue(1);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter products by category', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      const response = await request(app).get('/api/products?category=cat1');

      expect(response.status).toBe(200);
      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'cat1' })
      );
    });

    it('should support pagination', async () => {
      Product.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });
      Product.countDocuments.mockResolvedValue(0);

      const response = await request(app).get('/api/products?page=2&limit=5');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by id', async () => {
      const mockProduct = {
        _id: '665a1b2c3d4e5f6a7b8c9d0e',
        name: 'Product 1',
        price: 100,
        isActive: true,
        populate: jest.fn().mockResolvedValue({ name: 'Product 1' }),
      };
      Product.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockProduct) });

      const response = await request(app).get('/api/products/665a1b2c3d4e5f6a7b8c9d0e');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/products/invalid-id');

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent product', async () => {
      Product.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      const response = await request(app).get('/api/products/665a1b2c3d4e5f6a7b8c9d0e');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Test', price: 100 });

      expect(response.status).toBe(401);
    });
  });
});

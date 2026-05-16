const cartService = require('../../services/cartService');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const AppError = require('../../utils/AppError');

jest.mock('../../models/Cart');
jest.mock('../../models/Product');

describe('cartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return user cart with populated items', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: { name: 'Product 1', price: 100 }, quantity: 2 }],
      };
      Cart.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockCart),
      });

      const result = await cartService.getCart('user1');

      expect(result).toEqual(mockCart);
    });

    it('should throw 404 if cart not found', async () => {
      Cart.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(cartService.getCart('user1'))
        .rejects.toThrow('Không tìm thấy giỏ hàng!');
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({ items: [{ product: mockProduct, quantity: 2 }] }),
      };

      Product.findOne.mockResolvedValue(mockProduct);
      Cart.findOne.mockResolvedValue(mockCart);

      const result = await cartService.addToCart('user1', 'prod1', 2);

      expect(mockCart.items).toHaveLength(1);
      expect(mockCart.items[0].product).toBe('prod1');
      expect(mockCart.items[0].quantity).toBe(2);
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should increment quantity if item already in cart', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({}),
      };

      Product.findOne.mockResolvedValue(mockProduct);
      Cart.findOne.mockResolvedValue(mockCart);

      await cartService.addToCart('user1', 'prod1', 3);

      expect(mockCart.items[0].quantity).toBe(5);
    });

    it('should throw 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(cartService.addToCart('user1', 'prod1', 1))
        .rejects.toThrow('Sản phẩm không tồn tại!');
    });

    it('should throw 400 if insufficient stock', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 2, isActive: true };
      Product.findOne.mockResolvedValue(mockProduct);

      await expect(cartService.addToCart('user1', 'prod1', 5))
        .rejects.toThrow('Sản phẩm chỉ còn 2 trong kho!');
    });

    it('should throw 404 if cart not found', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: true };
      Product.findOne.mockResolvedValue(mockProduct);
      Cart.findOne.mockResolvedValue(null);

      await expect(cartService.addToCart('user1', 'prod1', 1))
        .rejects.toThrow('Không tìm thấy giỏ hàng!');
    });

    it('should throw 400 if combined quantity exceeds stock', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 3, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({}),
      };

      Product.findOne.mockResolvedValue(mockProduct);
      Cart.findOne.mockResolvedValue(mockCart);

      await expect(cartService.addToCart('user1', 'prod1', 2))
        .rejects.toThrow('Sản phẩm chỉ còn 3 trong kho!');
    });
  });

  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({}),
      };

      Cart.findOne.mockResolvedValue(mockCart);
      Product.findOne.mockResolvedValue(mockProduct);

      await cartService.updateCartItem('user1', 'prod1', 5);

      expect(mockCart.items[0].quantity).toBe(5);
    });

    it('should throw 404 if cart not found', async () => {
      Cart.findOne.mockResolvedValue(null);

      await expect(cartService.updateCartItem('user1', 'prod1', 1))
        .rejects.toThrow('Giỏ hàng trống!');
    });

    it('should throw 404 if item not in cart', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'other', quantity: 1 }],
      };
      Cart.findOne.mockResolvedValue(mockCart);

      await expect(cartService.updateCartItem('user1', 'prod1', 1))
        .rejects.toThrow('Sản phẩm không có trong giỏ hàng!');
    });

    it('should throw 400 if quantity exceeds stock', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 2, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 1 }],
      };

      Cart.findOne.mockResolvedValue(mockCart);
      Product.findOne.mockResolvedValue(mockProduct);

      await expect(cartService.updateCartItem('user1', 'prod1', 5))
        .rejects.toThrow('Sản phẩm chỉ còn 2 trong kho!');
    });

    it('should throw 404 if product is inactive', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 1 }],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({}),
      };

      Cart.findOne.mockResolvedValue(mockCart);
      Product.findOne.mockResolvedValue(null);

      await expect(cartService.updateCartItem('user1', 'prod1', 1))
        .rejects.toThrow('Sản phẩm không tồn tại!');
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
        populate: jest.fn().mockResolvedValue({ items: [] }),
      };
      Cart.findOne.mockResolvedValue(mockCart);

      await cartService.removeFromCart('user1', 'prod1');

      expect(mockCart.items).toHaveLength(0);
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should throw 404 if cart not found', async () => {
      Cart.findOne.mockResolvedValue(null);

      await expect(cartService.removeFromCart('user1', 'prod1'))
        .rejects.toThrow('Giỏ hàng trống!');
    });

    it('should throw 404 if item not in cart', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'other', quantity: 1 }],
      };
      Cart.findOne.mockResolvedValue(mockCart);

      await expect(cartService.removeFromCart('user1', 'prod1'))
        .rejects.toThrow('Sản phẩm không có trong giỏ hàng!');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
      };
      Cart.findOne.mockResolvedValue(mockCart);

      await cartService.clearCart('user1');

      expect(mockCart.items).toEqual([]);
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should throw 404 if cart not found', async () => {
      Cart.findOne.mockResolvedValue(null);

      await expect(cartService.clearCart('user1'))
        .rejects.toThrow('Giỏ hàng trống!');
    });
  });
});

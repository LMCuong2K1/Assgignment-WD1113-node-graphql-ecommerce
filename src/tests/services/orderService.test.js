const orderService = require('../../services/orderService');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const AppError = require('../../utils/AppError');

jest.mock('../../models/Order');
jest.mock('../../models/Cart');
jest.mock('../../models/Product');

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully from cart', async () => {
      const mockProduct = {
        _id: 'prod1',
        name: 'Product 1',
        price: 100,
        stock: 10,
        isActive: true,
      };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: mockProduct, quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
      };
      const mockOrder = {
        _id: 'order1',
        user: { name: 'User 1', email: 'user@test.com' },
        items: [{ product: mockProduct, quantity: 2, price: 100 }],
        totalPrice: 200,
        shippingAddress: '123 Street',
        populate: jest.fn().mockReturnThis(),
      };

      Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCart) });
      Product.findOneAndUpdate.mockResolvedValue({ stock: 8 });
      Order.create.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder('user1', '123 Street');

      expect(Order.create).toHaveBeenCalledWith({
        user: 'user1',
        items: [{ product: 'prod1', quantity: 2, price: 100 }],
        totalPrice: 200,
        shippingAddress: '123 Street',
      });
      expect(mockCart.items).toEqual([]);
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should throw 400 if cart is empty', async () => {
      const mockCart = { _id: 'cart1', user: 'user1', items: [] };
      Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCart) });

      await expect(orderService.createOrder('user1', '123 Street'))
        .rejects.toThrow('Giỏ hàng trống, không thể đặt hàng!');
    });

    it('should throw 400 if cart not found', async () => {
      Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

      await expect(orderService.createOrder('user1', '123 Street'))
        .rejects.toThrow('Giỏ hàng trống, không thể đặt hàng!');
    });

    it('should throw 400 if product is inactive', async () => {
      const mockProduct = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: false };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [{ product: mockProduct, quantity: 2 }],
        save: jest.fn().mockResolvedValue({}),
      };
      Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCart) });

      await expect(orderService.createOrder('user1', '123 Street'))
        .rejects.toThrow('Sản phẩm "Product 1" đã ngừng bán!');
    });

    it('should rollback stock if insufficient stock during order', async () => {
      const mockProduct1 = { _id: 'prod1', name: 'Product 1', price: 100, stock: 10, isActive: true };
      const mockProduct2 = { _id: 'prod2', name: 'Product 2', price: 50, stock: 1, isActive: true };
      const mockCart = {
        _id: 'cart1',
        user: 'user1',
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 5 },
        ],
        save: jest.fn().mockResolvedValue({}),
      };
      Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockCart) });
      Product.findOneAndUpdate
        .mockResolvedValueOnce({ stock: 8 })
        .mockResolvedValueOnce(null);

      await expect(orderService.createOrder('user1', '123 Street'))
        .rejects.toThrow('Sản phẩm "Product 2" không đủ hàng trong kho!');

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod1', { $inc: { stock: 2 } });
    });
  });

  describe('getOrders', () => {
    it('should return user orders', async () => {
      const mockOrders = [{ _id: 'order1', user: 'user1' }];
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockOrders),
      });

      const result = await orderService.getOrders('user1');

      expect(result).toEqual(mockOrders);
    });

    it('should return empty array if no orders', async () => {
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      });

      const result = await orderService.getOrders('user1');

      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('should return order if user is owner', async () => {
      const mockOrder = { _id: 'order1', user: 'user1' };
      const query = { populate: jest.fn() };
      Order.findById.mockReturnValue(query);
      query.populate
        .mockReturnValueOnce(query)
        .mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById('order1', 'user1', 'user');

      expect(result).toEqual(mockOrder);
    });

    it('should return order if user is admin', async () => {
      const mockOrder = { _id: 'order1', user: 'user2' };
      const query = { populate: jest.fn() };
      Order.findById.mockReturnValue(query);
      query.populate
        .mockReturnValueOnce(query)
        .mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById('order1', 'admin1', 'admin');

      expect(result).toEqual(mockOrder);
    });

    it('should throw 403 if user is not owner and not admin', async () => {
      const mockOrder = { _id: 'order1', user: 'user2' };
      const query = { populate: jest.fn() };
      Order.findById.mockReturnValue(query);
      query.populate
        .mockReturnValueOnce(query)
        .mockResolvedValue(mockOrder);

      await expect(orderService.getOrderById('order1', 'user1', 'user'))
        .rejects.toThrow('Bạn không có quyền xem đơn hàng này!');
    });

    it('should throw 404 if order not found', async () => {
      const query = { populate: jest.fn() };
      Order.findById.mockReturnValue(query);
      query.populate
        .mockReturnValueOnce(query)
        .mockResolvedValue(null);

      await expect(orderService.getOrderById('invalid-id', 'user1', 'user'))
        .rejects.toThrow('Không tìm thấy đơn hàng!');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status with valid transition', async () => {
      const mockOrder = {
        _id: 'order1',
        status: 'pending',
        save: jest.fn().mockResolvedValue({}),
      };
      Order.findById.mockResolvedValue(mockOrder);

      await orderService.updateOrderStatus('order1', 'processing');

      expect(mockOrder.status).toBe('processing');
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should throw 400 for invalid status transition', async () => {
      const mockOrder = {
        _id: 'order1',
        status: 'shipped',
        save: jest.fn().mockResolvedValue({}),
      };
      Order.findById.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('order1', 'processing'))
        .rejects.toThrow('Không thể chuyển từ "shipped" sang "processing"!');
    });

    it('should allow cancel for pending order', async () => {
      const mockOrder = {
        _id: 'order1',
        status: 'pending',
        save: jest.fn().mockResolvedValue({}),
      };
      Order.findById.mockResolvedValue(mockOrder);

      await orderService.updateOrderStatus('order1', 'cancelled');

      expect(mockOrder.status).toBe('cancelled');
    });

    it('should throw 400 for cancel after shipped', async () => {
      const mockOrder = {
        _id: 'order1',
        status: 'shipped',
        save: jest.fn().mockResolvedValue({}),
      };
      Order.findById.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('order1', 'cancelled'))
        .rejects.toThrow('Không thể hủy đơn hàng đã "shipped"!');
    });

    it('should throw 400 for cancel after delivered', async () => {
      const mockOrder = {
        _id: 'order1',
        status: 'delivered',
        save: jest.fn().mockResolvedValue({}),
      };
      Order.findById.mockResolvedValue(mockOrder);

      await expect(orderService.updateOrderStatus('order1', 'cancelled'))
        .rejects.toThrow('Không thể hủy đơn hàng đã "delivered"!');
    });

    it('should throw 404 if order not found', async () => {
      Order.findById.mockResolvedValue(null);

      await expect(orderService.updateOrderStatus('invalid-id', 'processing'))
        .rejects.toThrow('Không tìm thấy đơn hàng!');
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        { _id: 'order1', user: 'user1' },
        { _id: 'order2', user: 'user2' },
      ];
      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockOrders),
      });

      const result = await orderService.getAllOrders();

      expect(result).toEqual(mockOrders);
    });
  });
});

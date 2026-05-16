const orderResolver = require('../../graphql/resolvers/orderResolver');
const orderService = require('../../services/orderService');

jest.mock('../../services/orderService');

describe('orderResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.orders', () => {
    it('should return user orders', async () => {
      const mockOrders = [{ _id: 'order1' }];
      orderService.getOrders.mockResolvedValue(mockOrders);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await orderResolver.Query.orders({}, {}, context);

      expect(result).toEqual(mockOrders);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(orderResolver.Query.orders({}, {}, context))
        .rejects.toThrow('Bạn phải đăng nhập để thực hiện chức năng này!');
    });
  });

  describe('Query.order', () => {
    it('should return order by id', async () => {
      const mockOrder = { _id: '665a1b2c3d4e5f6a7b8c9d0e', user: '665a1b2c3d4e5f6a7b8c9d0e' };
      orderService.getOrderById.mockResolvedValue(mockOrder);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e', role: 'user' } };

      const result = await orderResolver.Query.order(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e' },
        context
      );

      expect(result).toEqual(mockOrder);
    });
  });

  describe('Query.allOrders', () => {
    it('should return all orders when admin', async () => {
      const mockOrders = [{ _id: 'order1' }];
      orderService.getAllOrders.mockResolvedValue(mockOrders);
      const context = { user: { role: 'admin' } };

      const result = await orderResolver.Query.allOrders({}, {}, context);

      expect(result).toEqual(mockOrders);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(orderResolver.Query.allOrders({}, {}, context))
        .rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });
  });

  describe('Mutation.createOrder', () => {
    it('should create order', async () => {
      const mockOrder = { _id: 'order1', totalPrice: 100 };
      orderService.createOrder.mockResolvedValue(mockOrder);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await orderResolver.Mutation.createOrder(
        {},
        { shippingAddress: '123 Street' },
        context
      );

      expect(result).toEqual(mockOrder);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        orderResolver.Mutation.createOrder({}, { shippingAddress: '123' }, context)
      ).rejects.toThrow('Bạn phải đăng nhập để thực hiện chức năng này!');
    });
  });

  describe('Mutation.updateOrderStatus', () => {
    it('should update order status when admin', async () => {
      const mockOrder = { _id: '665a1b2c3d4e5f6a7b8c9d0e', status: 'processing' };
      orderService.updateOrderStatus.mockResolvedValue(mockOrder);
      const context = { user: { role: 'admin' } };

      const result = await orderResolver.Mutation.updateOrderStatus(
        {},
        { id: '665a1b2c3d4e5f6a7b8c9d0e', status: 'processing' },
        context
      );

      expect(result).toEqual(mockOrder);
    });

    it('should throw error when not admin', async () => {
      const context = { user: { role: 'user' } };

      await expect(
        orderResolver.Mutation.updateOrderStatus({}, { id: '665a1b2c3d4e5f6a7b8c9d0e', status: 'processing' }, context)
      ).rejects.toThrow('Chỉ Admin mới có quyền thực hiện.');
    });
  });
});

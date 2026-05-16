const cartResolver = require('../../graphql/resolvers/cartResolver');
const cartService = require('../../services/cartService');

jest.mock('../../services/cartService');
jest.mock('graphql-fields', () => jest.fn(() => ({})));

describe('cartResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.cart', () => {
    it('should return user cart', async () => {
      const mockCart = { _id: 'cart1', items: [] };
      cartService.getCart.mockResolvedValue(mockCart);
      const context = { user: { id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await cartResolver.Query.cart({}, {}, context, {});

      expect(result).toEqual(mockCart);
      expect(cartService.getCart).toHaveBeenCalledWith('665a1b2c3d4e5f6a7b8c9d0e', '', '');
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(cartResolver.Query.cart({}, {}, context, {}))
        .rejects.toThrow('Bạn phải đăng nhập để sử dụng chức năng này!');
    });
  });

  describe('Mutation.addToCart', () => {
    it('should add item to cart', async () => {
      const mockCart = { _id: 'cart1', items: [{ product: '665a1b2c3d4e5f6a7b8c9d0e', quantity: 1 }] };
      cartService.addToCart.mockResolvedValue(mockCart);
      const context = { user: { id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await cartResolver.Mutation.addToCart(
        {},
        { input: { productId: '665a1b2c3d4e5f6a7b8c9d0e', quantity: 1 } },
        context
      );

      expect(result).toEqual(mockCart);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        cartResolver.Mutation.addToCart({}, { input: {} }, context)
      ).rejects.toThrow('Bạn phải đăng nhập để sử dụng chức năng này!');
    });
  });

  describe('Mutation.updateCartItem', () => {
    it('should update cart item', async () => {
      const mockCart = { _id: 'cart1', items: [{ product: '665a1b2c3d4e5f6a7b8c9d0e', quantity: 5 }] };
      cartService.updateCartItem.mockResolvedValue(mockCart);
      const context = { user: { id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await cartResolver.Mutation.updateCartItem(
        {},
        { input: { productId: '665a1b2c3d4e5f6a7b8c9d0e', quantity: 5 } },
        context
      );

      expect(result).toEqual(mockCart);
    });
  });

  describe('Mutation.removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockCart = { _id: 'cart1', items: [] };
      cartService.removeFromCart.mockResolvedValue(mockCart);
      const context = { user: { id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await cartResolver.Mutation.removeFromCart(
        {},
        { input: { productId: '665a1b2c3d4e5f6a7b8c9d0e' } },
        context
      );

      expect(result).toEqual(mockCart);
    });
  });

  describe('Mutation.clearCart', () => {
    it('should clear cart', async () => {
      const mockCart = { _id: 'cart1', items: [] };
      cartService.clearCart.mockResolvedValue(mockCart);
      const context = { user: { id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await cartResolver.Mutation.clearCart({}, {}, context);

      expect(result).toEqual(mockCart);
    });
  });
});

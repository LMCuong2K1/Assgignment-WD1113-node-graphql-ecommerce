const reviewResolver = require('../../graphql/resolvers/reviewResolver');
const reviewService = require('../../services/reviewService');

jest.mock('../../services/reviewService');

describe('reviewResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.productReviews', () => {
    it('should return product reviews', async () => {
      const mockReviews = [{ _id: 'rev1', rating: 5 }];
      reviewService.getProductReviews.mockResolvedValue(mockReviews);

      const result = await reviewResolver.Query.productReviews(
        {},
        { productId: '665a1b2c3d4e5f6a7b8c9d0e' },
        {},
        {}
      );

      expect(result).toEqual(mockReviews);
    });
  });

  describe('Mutation.createReview', () => {
    it('should create review', async () => {
      const mockReview = { _id: 'rev1', rating: 5, comment: 'Great!' };
      reviewService.createReview.mockResolvedValue(mockReview);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await reviewResolver.Mutation.createReview(
        {},
        { input: { productId: '665a1b2c3d4e5f6a7b8c9d0e', rating: 5, comment: 'Great!' } },
        context
      );

      expect(result).toEqual(mockReview);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        reviewResolver.Mutation.createReview({}, { input: {} }, context)
      ).rejects.toThrow('Bạn chưa đăng nhập!');
    });
  });

  describe('Mutation.updateReview', () => {
    it('should update review', async () => {
      const mockReview = { _id: 'rev1', rating: 4 };
      reviewService.updateReview.mockResolvedValue(mockReview);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await reviewResolver.Mutation.updateReview(
        {},
        { input: { reviewId: '665a1b2c3d4e5f6a7b8c9d0e', rating: 4 } },
        context
      );

      expect(result).toEqual(mockReview);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        reviewResolver.Mutation.updateReview({}, { input: {} }, context)
      ).rejects.toThrow('Bạn chưa đăng nhập!');
    });
  });

  describe('Mutation.deleteReview', () => {
    it('should delete review', async () => {
      reviewService.deleteReview.mockResolvedValue(true);
      const context = { user: { _id: '665a1b2c3d4e5f6a7b8c9d0e' } };

      const result = await reviewResolver.Mutation.deleteReview(
        {},
        { reviewId: '665a1b2c3d4e5f6a7b8c9d0e' },
        context
      );

      expect(result).toBe(true);
    });

    it('should throw error when not logged in', async () => {
      const context = { user: null };

      await expect(
        reviewResolver.Mutation.deleteReview({}, { reviewId: '665a1b2c3d4e5f6a7b8c9d0e' }, context)
      ).rejects.toThrow('Bạn chưa đăng nhập!');
    });
  });
});

jest.mock('../../models/Review', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findOneAndDelete: jest.fn(),
  findOneAndUpdate: jest.fn(),
  aggregate: jest.fn(),
}));

jest.mock('../../models/Product', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const Review = require('../../models/Review');
const Product = require('../../models/Product');
const AppError = require('../../utils/AppError');

describe('reviewService', () => {
  let reviewService;

  beforeEach(() => {
    jest.clearAllMocks();
    Review.aggregate.mockResolvedValue([]);
    reviewService = require('../../services/reviewService');
  });

  describe('createReview', () => {
    it('should create review successfully', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1', isActive: true };
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user1', rating: 5, comment: 'Great!' };
      Product.findOne.mockResolvedValue(mockProduct);
      Review.create.mockResolvedValue(mockReview);

      const result = await reviewService.createReview('665a1b2c3d4e5f6a7b8c9d0e', 'user1', { rating: 5, comment: 'Great!' });

      expect(Review.create).toHaveBeenCalledWith({
        product: '665a1b2c3d4e5f6a7b8c9d0e',
        user: 'user1',
        rating: 5,
        comment: 'Great!',
      });
      expect(result).toEqual(mockReview);
    });

    it('should throw 404 if product not found', async () => {
      Product.findOne.mockResolvedValue(null);

      await expect(reviewService.createReview('665a1b2c3d4e5f6a7b8c9d0e', 'user1', { rating: 5, comment: 'Great!' }))
        .rejects.toThrow('Sản phẩm không tồn tại!');
    });

    it('should throw 409 if user already reviewed', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1', isActive: true };
      Product.findOne.mockResolvedValue(mockProduct);
      Review.create.mockRejectedValue({ code: 11000 });

      await expect(reviewService.createReview('665a1b2c3d4e5f6a7b8c9d0e', 'user1', { rating: 5, comment: 'Great!' }))
        .rejects.toThrow('Bạn đã đánh giá sản phẩm này rồi!');
    });

    it('should rethrow non-duplicate errors', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1', isActive: true };
      Product.findOne.mockResolvedValue(mockProduct);
      const dbError = new Error('Database connection failed');
      dbError.code = 5000;
      Review.create.mockRejectedValue(dbError);

      await expect(reviewService.createReview('665a1b2c3d4e5f6a7b8c9d0e', 'user1', { rating: 5, comment: 'Great!' }))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('getProductReviews', () => {
    it('should return reviews for product', async () => {
      const mockProduct = { _id: '665a1b2c3d4e5f6a7b8c9d0e', name: 'Product 1' };
      const mockReviews = [
        { _id: 'rev1', user: { name: 'User 1' }, rating: 5, comment: 'Great!' },
      ];
      Product.findById.mockResolvedValue(mockProduct);
      Review.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockReviews),
      });

      const result = await reviewService.getProductReviews('665a1b2c3d4e5f6a7b8c9d0e');

      expect(result).toEqual(mockReviews);
    });

    it('should throw 404 if product not found', async () => {
      Product.findById.mockResolvedValue(null);

      await expect(reviewService.getProductReviews('665a1b2c3d4e5f6a7b8c9d0e'))
        .rejects.toThrow('Sản phẩm không tồn tại!');
    });
  });

  describe('deleteReview', () => {
    it('should delete review if user is owner', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user1' };
      Review.findById.mockResolvedValue(mockReview);
      Review.findOneAndDelete.mockResolvedValue({});

      const result = await reviewService.deleteReview('rev1', 'user1', 'user');

      expect(Review.findOneAndDelete).toHaveBeenCalledWith({ _id: 'rev1' });
      expect(result).toBe(true);
    });

    it('should delete review if user is admin', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user2' };
      Review.findById.mockResolvedValue(mockReview);
      Review.findOneAndDelete.mockResolvedValue({});

      const result = await reviewService.deleteReview('rev1', 'user1', 'admin');

      expect(result).toBe(true);
    });

    it('should throw 403 if user is not owner and not admin', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user2' };
      Review.findById.mockResolvedValue(mockReview);

      await expect(reviewService.deleteReview('rev1', 'user1', 'user'))
        .rejects.toThrow('Bạn không có quyền xóa đánh giá này!');
    });

    it('should throw 404 if review not found', async () => {
      Review.findById.mockResolvedValue(null);

      await expect(reviewService.deleteReview('invalid-id', 'user1', 'user'))
        .rejects.toThrow('Không tìm thấy đánh giá!');
    });
  });

  describe('updateReview', () => {
    it('should update review if user is owner', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user1' };
      const updatedReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user1', rating: 4, comment: 'Updated' };
      Review.findById.mockResolvedValue(mockReview);
      Review.findOneAndUpdate.mockResolvedValue(updatedReview);

      const result = await reviewService.updateReview('rev1', 'user1', 'user', { rating: 4, comment: 'Updated' });

      expect(result).toEqual(updatedReview);
    });

    it('should update review if user is admin', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user2' };
      const updatedReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user2', rating: 3 };
      Review.findById.mockResolvedValue(mockReview);
      Review.findOneAndUpdate.mockResolvedValue(updatedReview);

      const result = await reviewService.updateReview('rev1', 'user1', 'admin', { rating: 3 });

      expect(result).toEqual(updatedReview);
    });

    it('should throw 403 if user is not owner and not admin', async () => {
      const mockReview = { _id: 'rev1', product: '665a1b2c3d4e5f6a7b8c9d0e', user: 'user2' };
      Review.findById.mockResolvedValue(mockReview);

      await expect(reviewService.updateReview('rev1', 'user1', 'user', { rating: 4 }))
        .rejects.toThrow('Bạn không có quyền cập nhật đánh giá này!');
    });

    it('should throw 404 if review not found', async () => {
      Review.findById.mockResolvedValue(null);

      await expect(reviewService.updateReview('invalid-id', 'user1', 'user', { rating: 4 }))
        .rejects.toThrow('Không tìm thấy đánh giá!');
    });
  });

  describe('updateProductStats', () => {
    it('should update product stats with reviews', async () => {
      const mockStats = [{ _id: '665a1b2c3d4e5f6a7b8c9d0e', numReviews: 3, avgRating: 4.333 }];
      Review.aggregate.mockResolvedValue(mockStats);
      Product.findByIdAndUpdate.mockResolvedValue({});

      await reviewService.updateProductStats('665a1b2c3d4e5f6a7b8c9d0e');

      expect(Review.aggregate).toHaveBeenCalled();
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('665a1b2c3d4e5f6a7b8c9d0e', {
        rating: 4.3,
        numReviews: 3,
      });
    });

    it('should reset stats if no reviews', async () => {
      Review.aggregate.mockResolvedValue([]);
      Product.findByIdAndUpdate.mockResolvedValue({});

      await reviewService.updateProductStats('665a1b2c3d4e5f6a7b8c9d0e');

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('665a1b2c3d4e5f6a7b8c9d0e', {
        rating: 0,
        numReviews: 0,
      });
    });
  });
});

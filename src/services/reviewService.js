const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

class ReviewService {
  createReview = async (productId, userId, body) => {
    // Kiểm tra product có tồn tại không
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new AppError("Sản phẩm không tồn tại!",404);

    // Tạo review (nếu user đã review sẽ lỗi duplicate key do compound index)
    let review;
    try {
      review = await Review.create({
        product: productId,
        user: userId,
        rating: body.rating,
        comment: body.comment,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Bạn đã đánh giá sản phẩm này rồi!", 409);
      }
      throw error;
    }
    await this.updateProductStats(review.product);
    return review;
  };

  getProductReviews = async (productId) => {
    // Kiểm tra product có tồn tại không
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Sản phẩm không tồn tại!",404);

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return reviews;
  };

  deleteReview = async (reviewId, userId, userRole) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Không tìm thấy đánh giá!",404);

    // Chỉ chính chủ hoặc admin mới được xóa
    if (review.user.toString() !== userId && userRole !== "admin") {
      throw new AppError("Bạn không có quyền xóa đánh giá này!",403);
    }

    await Review.findOneAndDelete({ _id: reviewId });
    await this.updateProductStats(review.product);
    return true;
  };
  updateReview = async (reviewId, userId, userRole, body) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Không tìm thấy đánh giá!",404);
    if (review.user.toString() !== userId && userRole !== "admin")
      throw new AppError("Bạn không có quyền cập nhật đánh giá này!",403);

    const newReview = await Review.findOneAndUpdate(
      {
        _id: reviewId,
      },
      body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    await this.updateProductStats(newReview.product);
    return newReview;
  };
  updateProductStats = async (productId) => {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          numReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
    }
  };
}

module.exports = new ReviewService();

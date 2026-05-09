const Review = require("../models/Review");
const Product = require("../models/Product");

class ReviewService {
  createReview = async (productId, userId, body) => {
    // Kiểm tra product có tồn tại không
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new Error("Sản phẩm không tồn tại!");

    // Tạo review (nếu user đã review sẽ lỗi duplicate key do compound index)
    const review = await Review.create({
      product: productId,
      user: userId,
      rating: body.rating,
      comment: body.comment,
    });

    return review;
  };

  getProductReviews = async (productId) => {
    // Kiểm tra product có tồn tại không
    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại!");

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return reviews;
  };

  deleteReview = async (reviewId, userId, userRole) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error("Không tìm thấy đánh giá!");

    // Chỉ chính chủ hoặc admin mới được xóa
    if (review.user.toString() !== userId && userRole !== "admin") {
      throw new Error("Bạn không có quyền xóa đánh giá này!");
    }

    await Review.findOneAndDelete({ _id: reviewId });
    return review;
  };
}

module.exports = new ReviewService();

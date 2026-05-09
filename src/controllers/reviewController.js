const reviewService = require("../services/reviewService");

class ReviewController {
  // [POST] /api/products/:id/reviews
  createReview = async (req, res) => {
    try {
      const review = await reviewService.createReview(
        req.params.id,
        req.user._id,
        req.body
      );
      return res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      // Xử lý lỗi duplicate key (user đã review sản phẩm này rồi)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đánh giá sản phẩm này rồi!",
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [GET] /api/products/:id/reviews
  getProductReviews = async (req, res) => {
    try {
      const reviews = await reviewService.getProductReviews(req.params.id);
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [DELETE] /api/products/:id/reviews/:reviewId
  deleteReview = async (req, res) => {
    try {
      await reviewService.deleteReview(
        req.params.reviewId,
        req.user._id.toString(),
        req.user.role
      );
      return res.status(200).json({
        success: true,
        message: "Xóa đánh giá thành công!",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = new ReviewController();

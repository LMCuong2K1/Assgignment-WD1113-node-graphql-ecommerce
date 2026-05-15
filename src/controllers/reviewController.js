const catchAsync = require("../utils/catchAsync");
const reviewService = require("../services/reviewService");

class ReviewController {
  createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(
      req.params.id,
      req.user._id,
      req.body
    );
    return res.status(201).json({
      success: true,
      data: review,
    });
  });

  getProductReviews = catchAsync(async (req, res) => {
    const reviews = await reviewService.getProductReviews(req.params.id);
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  });

  updateReview = catchAsync(async (req, res) => {
    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.user._id.toString(),
      req.user.role,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: review,
    });
  });

  deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(
      req.params.reviewId,
      req.user._id.toString(),
      req.user.role
    );
    return res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công!",
    });
  });
}

module.exports = new ReviewController();

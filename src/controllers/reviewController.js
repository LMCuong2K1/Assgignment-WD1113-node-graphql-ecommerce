const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const reviewService = require("../services/reviewService");

class ReviewController {
  createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req.params.id, req.user._id, req.body);
    success(res, { data: review, statusCode: 201 });
  });

  getProductReviews = catchAsync(async (req, res) => {
    const reviews = await reviewService.getProductReviews(req.params.id);
    success(res, { data: reviews, count: reviews.length });
  });

  updateReview = catchAsync(async (req, res) => {
    const review = await reviewService.updateReview(req.params.reviewId, req.user._id.toString(), req.user.role, req.body);
    success(res, { data: review });
  });

  deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(req.params.reviewId, req.user._id.toString(), req.user.role);
    success(res, { message: "Xóa đánh giá thành công!" });
  });
}

module.exports = new ReviewController();

const reviewService = require("../../services/reviewService");
const {
  ratingInputSchema,
  commentInputSchema,
} = require("../../utils/review.validation");
const { objectIdSchema } = require("../../utils/validators");

const checkUser = (context) => {
  if (!context.user) throw new Error("Bạn chưa đăng nhập!");
  return context.user;
};

module.exports = {
  Query: {
    getProductReviews: async (_, args, context, info) => {
      objectIdSchema.parse(args.productId);
      return await reviewService.getProductReviews(args.productId);
    },
  },
  Mutation: {
    createReview: async (_, args, context, info) => {
      const user = checkUser(context);
      objectIdSchema.parse(args.input.productId);
      ratingInputSchema.parse(args.input.rating);
      return await reviewService.createReview(args.input.productId, user.id, {
        rating: args.input.rating,
        comment: args.input.comment,
      });
    },
    updateReview: async (_, args, context, info) => {
      const user = checkUser(context);
      objectIdSchema.parse(args.input.reviewId);
      if (args.input.rating !== undefined && args.input.rating !== null) {
        ratingInputSchema.parse(args.input.rating);
      }
      return await reviewService.updateReview(
        args.input.reviewId,
        user.id,
        user.role,
        {
          rating: args.input.rating,
          comment: args.input.comment,
        },
      );
    },
    deleteReview: async (_, args, context, info) => {
      const user = checkUser(context);
      objectIdSchema.parse(args.reviewId);
      await reviewService.deleteReview(
        args.reviewId,
        user.id,
        user.role,
      );
      return true;
    },
  },
};

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
  typeDefs: `#graphql
    type Review{
    _id:ID!
    user:User!
    product:Product!
    rating:Int!
    comment:String
    createdAt:String
    updatedAt:String
    }
    input CreateReviewInput{
    productId:ID!
    rating:Int!
    comment:String
    }
    input UpdateReviewInput{
    reviewId:ID!
    rating:Int
    comment:String
    }
    type Query{
    getProductReviews(productId:ID!):[Review]
    }
    type Mutation{
    createReview(input:CreateReviewInput!):Review
    updateReview(input:UpdateReviewInput!):Review
    deleteReview(reviewId:ID!):Boolean
    }
    `,
  resolvers: {
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
  },
};

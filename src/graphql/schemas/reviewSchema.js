const reviewService = require("../../services/reviewService");

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
        return await reviewService.getProductReviews(args.productId);
      },
    },
    Mutation: {
      createReview: async (_, args, context, info) => {
        const user = checkUser(context);
        return await reviewService.createReview(args.input.productId, user.id, {
          rating: args.input.rating,
          comment: args.input.comment,
        });
      },
      updateReview: async (_, args, context, info) => {
        const user = checkUser(context);
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
        const review = await reviewService.deleteReview(
          args.reviewId,
          user.id,
          user.role,
        );
        return true;
      },
    },
  },
};

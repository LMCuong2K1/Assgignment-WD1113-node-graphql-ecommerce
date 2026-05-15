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
};

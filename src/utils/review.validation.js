const { z } = require("zod");
const { objectIdSchema } = require("./validators");

const ratingInputSchema = z
  .number({ required_error: "Điểm đánh giá không được để trống!" })
  .int({ message: "Điểm đánh giá phải là số nguyên!" })
  .min(1, { message: "Điểm đánh giá tối thiểu là 1!" })
  .max(5, { message: "Điểm đánh giá tối đa là 5!" });
const commentInputSchema = z.string().trim().optional();
module.exports = {
  ratingInputSchema,
  commentInputSchema,
  createReviewSchema: z.object({
    params: z.object({ id: objectIdSchema }),
    body: z.object({
      rating: ratingInputSchema,
      comment: commentInputSchema,
    }),
  }),
  getProductReviewsSchema: z.object({
    params: z.object({ id: objectIdSchema }),
  }),
  deleteReviewSchema: z.object({
    params: z.object({
      id: objectIdSchema,
      reviewId: objectIdSchema,
    }),
  }),
};

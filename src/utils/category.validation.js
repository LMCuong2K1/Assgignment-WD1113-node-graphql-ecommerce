const { z } = require("zod");
const { objectIdSchema } = require("./validators");

module.exports = {
  createCategorySchema: z.object({
    body: z.object({
      name: z.string({ required_error: "Tên không được để trống!" }).trim(),
      description: z.string().trim().optional(),
      parent: objectIdSchema.optional(),
      isActive: z.boolean().optional(),
    }),
  }),
  getCategoryByIdSchema: z.object({
    params: z.object({ id: objectIdSchema }),
  }),
  updateCategorySchema: z.object({
    params: z.object({ id: objectIdSchema }),
    body: z.object({
      name: z.string().optional(),
      description: z.string().trim().optional(),
      parent: objectIdSchema.optional(),
      isActive: z.boolean().optional(),
    }),
  }),
  deleteCategorySchema: z.object({
    params: z.object({ id: objectIdSchema }),
  }),
};

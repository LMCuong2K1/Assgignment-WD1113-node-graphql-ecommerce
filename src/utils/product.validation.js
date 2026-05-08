const { z } = require("zod");
const { objectIdSchema } = require("./validators");

module.exports = {
    createProductSchema: z.object({
        body: z.object({
            name: z.string({ required_error: "Tên không được để trống!" }).trim(),
            description: z.string({ required_error: "Sản phẩm cần có mô tả!" }).trim(),
            price: z.number({ required_error: "Giá không được để trống!" }).min(0, { message: "Giá phải lớn hơn hoặc bằng 0!" }),
            stock: z.number({ required_error: "Số lượng không được để trống!" }).min(0, { message: "Số lượng phải lớn hơn hoặc bằng 0!" }),
            category: objectIdSchema,
            images: z.array(z.object({
                url: z.string({ required_error: "URL ảnh không được để trống" }),
                public_id: z.string().optional()
            })).optional(),
            sku: z.string({ required_error: "SKU không được để trống!" }).trim(),
            isActive: z.boolean().optional(),
        }),
    }),
    getProductByIdSchema: z.object({
        params: z.object({ id: objectIdSchema }),
    }),
    updateProductSchema: z.object({
        params: z.object({ id: objectIdSchema }),
        body: z.object({
            name: z.string().trim().optional(),
            description: z.string().trim().optional(),
            price: z.number().min(0).optional(),
            stock: z.number().min(0).optional(),
            category: objectIdSchema.optional(),
            images: z.array(z.object({
                url: z.string(),
                public_id: z.string().optional()
            })).optional(),
            sku: z.string().trim().optional(),
            isActive: z.boolean().optional(),
        }),
    }),
    deleteProductSchema: z.object({
        params: z.object({ id: objectIdSchema }),
    }),
};

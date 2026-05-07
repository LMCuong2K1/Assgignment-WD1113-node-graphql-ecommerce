const mongoose = require("mongoose");
const { z } = require("zod");

module.exports = {
  objectIdSchema: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "ID không hợp lệ hoặc bỏ trống!",
    }),
};

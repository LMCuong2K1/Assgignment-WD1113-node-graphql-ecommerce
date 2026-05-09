const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method: tính lại rating trung bình và số lượng review cho Product
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const Product = require("./Product");
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10, // làm tròn 1 chữ số thập phân
      numReviews: stats[0].numReviews,
    });
  } else {
    // Không còn review nào → reset về mặc định
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};

// Sau khi save (tạo mới) → tính lại
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

// Sau khi xóa (findOneAndDelete) → tính lại
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calcAverageRatings(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

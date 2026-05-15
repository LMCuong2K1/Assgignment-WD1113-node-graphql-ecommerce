const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

class OrderService {
  // Tạo đơn hàng từ giỏ hàng
  createOrder = async (userId, shippingAddress) => {
    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price stock isActive"
    );
    if (!cart || cart.items.length === 0)
      throw new AppError("Giỏ hàng trống, không thể đặt hàng!",400);

    // 2. Kiểm tra & trừ tồn kho bằng Atomic Update (chống race condition)
    const orderItems = [];
    for (const item of cart.items) {
      // Kiểm tra sản phẩm còn active không
      if (!item.product.isActive) {
        throw new AppError(`Sản phẩm "${item.product.name}" đã ngừng bán!`,400);
      }

      // Atomic: Chỉ trừ stock nếu stock >= quantity
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { returnDocument: "after" }
      );

      if (!updated) {
        // Hoàn trả stock cho các sản phẩm đã trừ trước đó
        for (const rolled of orderItems) {
          await Product.findByIdAndUpdate(rolled.product, {
            $inc: { stock: rolled.quantity },
          });
        }
        throw new AppError(
          `Sản phẩm "${item.product.name}" không đủ hàng trong kho!`,400
        );
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // 3. Tính tổng tiền
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4. Tạo đơn hàng
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
    });

    // 5. Xóa giỏ hàng sau khi đặt hàng thành công
    cart.items = [];
    await cart.save();

    await order.populate("user", "name email");
    await order.populate("items.product", "name price images slug");
    return order;
  };

  // Lấy danh sách đơn hàng của user
  getOrders = async (userId) => {
    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name price images slug")
      .sort({ createdAt: -1 });
    return orders;
  };

  // Lấy chi tiết 1 đơn hàng
  getOrderById = async (orderId, userId, userRole) => {
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name price images slug");
    if (!order) throw new AppError("Không tìm thấy đơn hàng!", 404);

    // User thường chỉ xem được đơn của mình
    if (userRole !== "admin" && order.user.toString() !== userId) {
      throw new AppError("Bạn không có quyền xem đơn hàng này!",403);
    }

    return order;
  };

  // Admin cập nhật trạng thái đơn hàng
  updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Không tìm thấy đơn hàng!",404);

    // Kiểm tra logic chuyển trạng thái (chỉ đi theo thứ tự)
    if (status === "cancelled") {
      if (order.status === "shipped" || order.status === "delivered") {
        throw new AppError(
          `Không thể hủy đơn hàng đã "${order.status}"!`,400
        );
      }
    } else {
      const statusFlow = ["pending", "processing", "shipped", "delivered"];
      const currentIndex = statusFlow.indexOf(order.status);
      const newIndex = statusFlow.indexOf(status);

      if (newIndex <= currentIndex) {
        throw new AppError(
          `Không thể chuyển từ "${order.status}" sang "${status}"!`,400
        );
      }
    }

    order.status = status;
    await order.save();

    return order;
  };

  // Admin lấy tất cả đơn hàng
  getAllOrders = async () => {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images slug")
      .sort({ createdAt: -1 });
    return orders;
  };
}

module.exports = new OrderService();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class OrderService {
  // Tạo đơn hàng từ giỏ hàng
  createOrder = async (userId, shippingAddress) => {
    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price stock isActive"
    );
    if (!cart || cart.items.length === 0)
      throw new Error("Giỏ hàng trống, không thể đặt hàng!");

    // 2. Kiểm tra & trừ tồn kho bằng Atomic Update (chống race condition)
    const orderItems = [];
    for (const item of cart.items) {
      // Kiểm tra sản phẩm còn active không
      if (!item.product.isActive) {
        throw new Error(`Sản phẩm "${item.product.name}" đã ngừng bán!`);
      }

      // Atomic: Chỉ trừ stock nếu stock >= quantity
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        // Hoàn trả stock cho các sản phẩm đã trừ trước đó
        for (const rolled of orderItems) {
          await Product.findByIdAndUpdate(rolled.product, {
            $inc: { stock: rolled.quantity },
          });
        }
        throw new Error(
          `Sản phẩm "${item.product.name}" không đủ hàng trong kho!`
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

    return order.populate("items.product", "name price images slug");
  };

  // Lấy danh sách đơn hàng của user
  getOrders = async (userId) => {
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price images slug")
      .sort({ createdAt: -1 });
    return orders;
  };

  // Lấy chi tiết 1 đơn hàng
  getOrderById = async (orderId, userId, userRole) => {
    const order = await Order.findById(orderId).populate(
      "items.product",
      "name price images slug"
    );
    if (!order) throw new Error("Không tìm thấy đơn hàng!");

    // User thường chỉ xem được đơn của mình
    if (userRole !== "admin" && order.user.toString() !== userId) {
      throw new Error("Bạn không có quyền xem đơn hàng này!");
    }

    return order;
  };

  // Admin cập nhật trạng thái đơn hàng
  updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng!");

    // Kiểm tra logic chuyển trạng thái (chỉ đi theo thứ tự)
    const statusFlow = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);

    if (newIndex <= currentIndex) {
      throw new Error(
        `Không thể chuyển từ "${order.status}" sang "${status}"!`
      );
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

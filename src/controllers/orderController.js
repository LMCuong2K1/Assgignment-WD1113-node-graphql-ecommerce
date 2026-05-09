const orderService = require("../services/orderService");

class OrderController {
  // [POST] /api/orders — Tạo đơn hàng từ giỏ
  createOrder = async (req, res) => {
    try {
      const order = await orderService.createOrder(
        req.user._id,
        req.body.shippingAddress
      );
      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [GET] /api/orders — Lấy danh sách đơn hàng của user
  getOrders = async (req, res) => {
    try {
      const orders = await orderService.getOrders(req.user._id);
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [GET] /api/orders/:id — Lấy chi tiết 1 đơn hàng
  getOrderById = async (req, res) => {
    try {
      const order = await orderService.getOrderById(
        req.params.id,
        req.user._id.toString(),
        req.user.role
      );
      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [PUT] /api/orders/:id/status — Admin cập nhật trạng thái
  updateOrderStatus = async (req, res) => {
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [GET] /api/orders/all — Admin lấy tất cả đơn hàng
  getAllOrders = async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = new OrderController();

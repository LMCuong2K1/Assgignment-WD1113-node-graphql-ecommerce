const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/orderService");

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(
      req.user._id,
      req.body.shippingAddress
    );
    return res.status(201).json({
      success: true,
      data: order,
    });
  });

  getOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getOrders(req.user._id);
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  });

  getOrderById = catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user._id.toString(),
      req.user.role
    );
    return res.status(200).json({
      success: true,
      data: order,
    });
  });

  updateOrderStatus = catchAsync(async (req, res) => {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    return res.status(200).json({
      success: true,
      data: order,
    });
  });

  getAllOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  });
}

module.exports = new OrderController();

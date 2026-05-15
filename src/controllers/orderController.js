const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const orderService = require("../services/orderService");

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.user._id, req.body.shippingAddress);
    success(res, { data: order, statusCode: 201 });
  });

  getOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getOrders(req.user._id);
    success(res, { data: orders, count: orders.length });
  });

  getOrderById = catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id, req.user._id.toString(), req.user.role);
    success(res, { data: order });
  });

  updateOrderStatus = catchAsync(async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    success(res, { data: order });
  });

  getAllOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getAllOrders();
    success(res, { data: orders, count: orders.length });
  });
}

module.exports = new OrderController();

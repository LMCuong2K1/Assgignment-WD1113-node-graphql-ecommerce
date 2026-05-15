const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const cartService = require("../services/cartService");

class CartController {
  getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    success(res, { data: cart });
  });

  addToCart = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    success(res, { data: cart });
  });

  updateCartItem = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
    success(res, { data: cart });
  });

  removeFromCart = catchAsync(async (req, res) => {
    const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
    success(res, { data: cart });
  });

  clearCart = catchAsync(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    success(res, { data: cart, message: "Đã xóa toàn bộ giỏ hàng!" });
  });
}

module.exports = new CartController();

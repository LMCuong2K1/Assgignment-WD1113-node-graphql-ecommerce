const catchAsync = require("../utils/catchAsync");
const cartService = require("../services/cartService");

class CartController {
  getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  });

  addToCart = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  });

  updateCartItem = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  });

  removeFromCart = catchAsync(async (req, res) => {
    const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  });

  clearCart = catchAsync(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng!",
      data: cart,
    });
  });
}

module.exports = new CartController();

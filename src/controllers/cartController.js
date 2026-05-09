const cartService = require("../services/cartService");

class CartController {
  // [GET] /api/cart
  getCart = async (req, res) => {
    try {
      const cart = await cartService.getCart(req.user._id);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [POST] /api/cart/add
  addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(req.user._id, productId, quantity);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [PUT] /api/cart/update
  updateCartItem = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [DELETE] /api/cart/remove/:productId
  removeFromCart = async (req, res) => {
    try {
      const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // [DELETE] /api/cart/clear
  clearCart = async (req, res) => {
    try {
      const cart = await cartService.clearCart(req.user._id);
      return res.status(200).json({
        success: true,
        message: "Đã xóa toàn bộ giỏ hàng!",
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = new CartController();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError=require("../utils/AppError");
class CartService {
  // Lấy giỏ hàng của user (đã được tạo sẵn khi đăng ký)
  getCart = async (
    userId,
    cartFields = "",
    productFields = "name price stock images slug",
  ) => {
    const cart = await Cart.findOne({ user: userId })
      .select(cartFields)
      .populate("items.product", productFields);

    if (!cart) throw new AppError("Không tìm thấy giỏ hàng!",404);

    return cart;
  };

  // Thêm sản phẩm vào giỏ
  addToCart = async (
    userId,
    productId,
    quantity,
    cartFields = "",
    productFields = "name price stock images slug",
  ) => {
    // Kiểm tra product tồn tại và còn hàng
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new AppError("Sản phẩm không tồn tại!", 404);
    if (product.stock < quantity)
      throw new AppError(`Sản phẩm chỉ còn ${product.stock} trong kho!`,400);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Không tìm thấy giỏ hàng!",404);

    // Kiểm tra sản phẩm đã trong giỏ chưa
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // Đã có → cộng dồn số lượng
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock)
        throw new AppError(`Sản phẩm chỉ còn ${product.stock} trong kho!`,400);
      existingItem.quantity = newQty;
    } else {
      // Chưa có → thêm item mới vào mảng
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate trả về cho client
    return cart.populate("items.product", productFields);
  };

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem = async (
    userId,
    productId,
    quantity,
    cartFields = "",
    productFields = "name price stock images slug",
  ) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Giỏ hàng trống!",404);

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (!item) throw new AppError("Sản phẩm không có trong giỏ hàng!",404);

    // Kiểm tra tồn kho
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new AppError("Sản phẩm không tồn tại!",404);
    if (quantity > product.stock)
      throw new AppError(`Sản phẩm chỉ còn ${product.stock} trong kho!`,400);

    item.quantity = quantity;
    await cart.save();

    return cart.populate("items.product", productFields);
  };

  // Xóa 1 sản phẩm khỏi giỏ
  removeFromCart = async (
    userId,
    productId,
    cartFields = "",
    productFields = "name price stock images slug",
  ) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Giỏ hàng trống!",404);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) throw new AppError("Sản phẩm không có trong giỏ hàng!",404);

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return cart.populate("items.product", productFields);
  };

  // Xóa toàn bộ giỏ hàng
  clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Giỏ hàng trống!",404);

    cart.items = [];
    await cart.save();

    return cart;
  };
}

module.exports = new CartService();

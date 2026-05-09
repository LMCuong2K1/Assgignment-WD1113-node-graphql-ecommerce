const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartService {
  // Lấy giỏ hàng của user (tạo mới nếu chưa có)
  getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price stock images slug"
    );

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  };

  // Thêm sản phẩm vào giỏ
  addToCart = async (userId, productId, quantity) => {
    // Kiểm tra product tồn tại và còn hàng
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new Error("Sản phẩm không tồn tại!");
    if (product.stock < quantity)
      throw new Error(`Sản phẩm chỉ còn ${product.stock} trong kho!`);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Chưa có giỏ → tạo mới luôn
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Đã có giỏ → kiểm tra sản phẩm đã trong giỏ chưa
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Đã có → cộng dồn số lượng
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock)
          throw new Error(`Sản phẩm chỉ còn ${product.stock} trong kho!`);
        existingItem.quantity = newQty;
      } else {
        // Chưa có → thêm item mới vào mảng
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate trả về cho client
    return cart.populate("items.product", "name price stock images slug");
  };

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Giỏ hàng trống!");

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) throw new Error("Sản phẩm không có trong giỏ hàng!");

    // Kiểm tra tồn kho
    const product = await Product.findById(productId);
    if (quantity > product.stock)
      throw new Error(`Sản phẩm chỉ còn ${product.stock} trong kho!`);

    item.quantity = quantity;
    await cart.save();

    return cart.populate("items.product", "name price stock images slug");
  };

  // Xóa 1 sản phẩm khỏi giỏ
  removeFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Giỏ hàng trống!");

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) throw new Error("Sản phẩm không có trong giỏ hàng!");

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return cart.populate("items.product", "name price stock images slug");
  };

  // Xóa toàn bộ giỏ hàng
  clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Giỏ hàng trống!");

    cart.items = [];
    await cart.save();

    return cart;
  };
}

module.exports = new CartService();

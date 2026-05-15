const User = require("../models/User");
const Cart = require("../models/Cart");
const jwt = require("../utils/jwt");
const AppError = require("../utils/AppError");
class AuthService {
  register = async (userInfo) => {
    if (await User.findOne({ email: userInfo.email })) {
      throw new AppError("Email đã được sử dụng!",409);
    }
    const user = await User.create(userInfo);
    // Tạo giỏ hàng mặc định cho user mới
    await Cart.create({ user: user._id, items: [] });
    const token = jwt.generateToken(user._id);
    return { user, token };
  };

  login = async (userInfo) => {
    const user = await User.findOne({ email: userInfo.email }).select(
      "+password",
    );
    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng!",401);
    }
    if (!(await user.matchPassword(userInfo.password))) {
      throw new AppError("Email hoặc mật khẩu không đúng!",401);
    }
    const token = jwt.generateToken(user._id);
    return { user, token };
  };
  getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("Không tìm thấy user!",404);
    return user;
  };
  updateProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) throw new AppError("Không tìm thấy user!",404);
    return user;
  };

   getAllUsers = async () => {
     return await User.find({});
   };

   getUserById = async (userId) => {
     const user = await User.findById(userId);
     if (!user) throw new AppError("Không tìm thấy user!",404);
     return user;
   };

  updateUserByAdmin = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("Không tìm thấy user!",404);

    // Gán từng trường để Mongoose pre('save') có thể hash password
    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    await user.save();
    return user;
  };
}

module.exports = new AuthService();

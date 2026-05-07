const User = require("../models/User");
const jwt = require("../utils/jwt");
class AuthService {
  register = async (userInfo) => {
    if (await User.findOne({ email: userInfo.email })) {
      throw new Error("Email đã được sử dụng!");
    }
    const user = await User.create(userInfo);
    const token = jwt.generateToken(user._id);
    return { user, token };
  };

  login = async (userInfo) => {
    const user = await User.findOne({ email: userInfo.email }).select(
      "+password",
    );
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }
    if (!(await user.matchPassword(userInfo.password))) {
      throw new Error("Email hoặc mật khẩu không đúng!");
    }
    const token = jwt.generateToken(user._id);
    return { user, token };
  };
  getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("Không tìm thấy user!");
    return user;
  };
  updateProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new Error("Không tìm thấy user!");
    return user;
  };

  getAllUsers = async () => {
    return await User.find({});
  };

  updateUserByAdmin = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new Error("Không tìm thấy user!");
    return user;
  };
}

module.exports = new AuthService();

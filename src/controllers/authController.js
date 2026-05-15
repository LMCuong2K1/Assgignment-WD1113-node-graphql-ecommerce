const authService = require("../services/authService");

class AuthController {
  register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      const { user, token } = await authService.register({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
        data: {
          email: user.email,
          name: user.name,
          _id: user._id,
          token,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Đăng ký thất bại!",
        error: err.message,
      });
    }
  };
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const { user, token } = await authService.login({ email, password });
      res.status(200).json({
        success: true,
        data: {
          email: user.email,
          name: user.name,
          _id: user._id,
          token,
        },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Đăng nhập thất bại!",
        error: err.message,
      });
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await authService.getProfile(req.user._id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Lấy thông tin thất bại!",
        error: err.message,
      });
    }
  };
  updateProfile = async (req, res) => {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Cập nhật thông tin thất bại!",
        error: err.message,
      });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Lấy danh sách người dùng thất bại!",
        error: err.message,
      });
    }
  };

  updateUserByAdmin = async (req, res) => {
    try {
      const user = await authService.updateUserByAdmin(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Cập nhật tài khoản thất bại!",
        error: err.message,
      });
    }
  };
}
module.exports = new AuthController();

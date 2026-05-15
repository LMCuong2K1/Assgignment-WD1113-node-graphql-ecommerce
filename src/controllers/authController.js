const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authService");

class AuthController {
  register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
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
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
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
  });

  getProfile = catchAsync(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  updateProfile = catchAsync(async (req, res) => {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getAllUsers = catchAsync(async (req, res) => {
    const users = await authService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  });

  updateUserByAdmin = catchAsync(async (req, res) => {
    const user = await authService.updateUserByAdmin(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

module.exports = new AuthController();

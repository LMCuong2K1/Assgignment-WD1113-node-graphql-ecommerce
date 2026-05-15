const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/response");
const authService = require("../services/authService");

class AuthController {
  register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register({ name, email, password });
    success(res, {
      data: { email: user.email, name: user.name, _id: user._id, token },
      statusCode: 201,
    });
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    success(res, {
      data: { email: user.email, name: user.name, _id: user._id, token },
    });
  });

  getProfile = catchAsync(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    success(res, { data: user });
  });

  updateProfile = catchAsync(async (req, res) => {
    const user = await authService.updateProfile(req.user._id, req.body);
    success(res, { data: user });
  });

  getAllUsers = catchAsync(async (req, res) => {
    const users = await authService.getAllUsers();
    success(res, { data: users });
  });

  updateUserByAdmin = catchAsync(async (req, res) => {
    const user = await authService.updateUserByAdmin(req.params.id, req.body);
    success(res, { data: user });
  });
}

module.exports = new AuthController();

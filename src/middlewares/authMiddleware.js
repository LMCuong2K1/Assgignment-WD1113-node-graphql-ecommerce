const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthMiddleware {
  protect = async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, token failed!" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed!" });
    }
  };
  admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") next();
    else
      return res
        .status(403)
        .json({ success: false, message: "Not authorized, token failed!" });
  };
}

module.exports = new AuthMiddleware();

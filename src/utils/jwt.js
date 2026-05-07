const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
    return token;
  },
};


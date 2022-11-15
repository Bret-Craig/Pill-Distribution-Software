const jwt = require("jsonwebtoken");
const User = require("../db/userInfo");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      throw new Error("Not authorized, token failed");
      res.status(401);
    }
  }

  if (!token) {
    throw new Error("Not authorized, no token");
    res.status(401);
  }
});

module.exports = { protect };
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

module.exports = {
  createAccessToken,
  createRefreshToken,
  hashToken
};

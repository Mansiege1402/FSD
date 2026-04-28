const asyncHandler = require("../utils/asyncHandler");
const {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser
} = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const payload = await registerUser(req.body);
  res.status(201).json(payload);
});

const login = asyncHandler(async (req, res) => {
  const payload = await loginUser(req.body);
  res.json(payload);
});

const refresh = asyncHandler(async (req, res) => {
  const payload = await refreshUserToken(req.body.refreshToken);
  res.json(payload);
});

const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id, req.body.refreshToken);
  res.json({ message: "Logged out successfully" });
});

module.exports = { register, login, refresh, logout };

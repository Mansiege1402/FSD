const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const NgoProfile = require("../models/NgoProfile");
const ApiError = require("../utils/ApiError");
const { createAccessToken, createRefreshToken, hashToken } = require("../utils/token");
const { ROLES } = require("../utils/roles");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  organizationName: user.organizationName,
  isEmailVerified: user.isEmailVerified,
  volunteerHours: user.volunteerHours,
  partnerScore: user.partnerScore
});

const issueTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshTokens.push(hashToken(refreshToken));
  await user.save();

  return {
    token: accessToken,
    accessToken,
    refreshToken,
    user: sanitizeUser(user)
  };
};

const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const assignedRole = [ROLES.ADMIN, ROLES.NGO, ROLES.VOLUNTEER, ROLES.USER].includes(role)
    ? role
    : ROLES.USER;

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: assignedRole,
    organizationName: assignedRole === ROLES.NGO ? name : ""
  });

  if (assignedRole === ROLES.NGO) {
    await NgoProfile.create({ user: user._id });
  }

  return issueTokens(user);
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  return issueTokens(user);
};

const refreshUserToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (_error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const hashed = hashToken(refreshToken);
  if (!user.refreshTokens.includes(hashed)) {
    throw new ApiError(401, "Refresh token revoked");
  }

  user.refreshTokens = user.refreshTokens.filter((token) => token !== hashed);
  await user.save();

  return issueTokens(user);
};

const logoutUser = async (userId, refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    return;
  }

  const hashed = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter((token) => token !== hashed);
  await user.save();
};

module.exports = {
  sanitizeUser,
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser
};

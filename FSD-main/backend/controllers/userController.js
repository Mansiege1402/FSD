const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../services/authService");
const { getPlatformMetrics } = require("../services/metricsService");

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(sanitizeUser(req.user));
});

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password -refreshTokens").sort({ createdAt: -1 });
  res.json(users);
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "phone", "location", "avatar", "skills", "causes", "organizationName"];

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  res.json(sanitizeUser(req.user));
});

const getAnalyticsOverview = asyncHandler(async (_req, res) => {
  const metrics = await getPlatformMetrics();
  res.json(metrics);
});

module.exports = { getCurrentUser, getUsers, updateProfile, getAnalyticsOverview };

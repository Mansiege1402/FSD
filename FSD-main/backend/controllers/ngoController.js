const NgoProfile = require("../models/NgoProfile");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../utils/roles");

const getNgos = asyncHandler(async (_req, res) => {
  const ngos = await User.find({ role: ROLES.NGO }).select("-password -refreshTokens").sort({ createdAt: -1 });
  const profiles = await NgoProfile.find().populate("user", "name email organizationName location");
  res.json({ ngos, profiles });
});

const getNgoProfile = asyncHandler(async (req, res) => {
  const profile = await NgoProfile.findOne({ user: req.params.id }).populate(
    "user",
    "name email organizationName bio location"
  );

  if (!profile) {
    throw new ApiError(404, "NGO profile not found");
  }

  res.json(profile);
});

const updateNgoVerification = asyncHandler(async (req, res) => {
  const profile = await NgoProfile.findOne({ user: req.params.id });
  if (!profile) {
    throw new ApiError(404, "NGO profile not found");
  }

  profile.verificationStatus = req.body.verificationStatus;
  profile.verificationBadge = req.body.verificationStatus === "verified";
  await profile.save();

  res.json(profile);
});

module.exports = { getNgos, getNgoProfile, updateNgoVerification };

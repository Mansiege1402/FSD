const Review = require("../models/Review");
const NgoProfile = require("../models/NgoProfile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createReview = asyncHandler(async (req, res) => {
  const ngoProfile = await NgoProfile.findOne({ user: req.body.ngo });
  if (!ngoProfile) {
    throw new ApiError(404, "NGO profile not found");
  }

  const review = await Review.create({ ...req.body, reviewer: req.user._id });
  res.status(201).json(review);
});

const getNgoReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ ngo: req.params.id }).populate("reviewer", "name role").sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = { createReview, getNgoReviews };

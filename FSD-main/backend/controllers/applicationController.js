const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const applyToOpportunity = asyncHandler(async (req, res) => {
  const { opportunityId, note } = req.body;
  const opportunity = await Opportunity.findById(opportunityId);

  if (!opportunity) {
    throw new ApiError(404, "Opportunity not found");
  }

  const existing = await Application.findOne({ userId: req.user._id, opportunityId });
  if (existing) {
    throw new ApiError(409, "You have already applied to this opportunity");
  }

  const application = await Application.create({
    userId: req.user._id,
    opportunityId,
    note: note || ""
  });

  res.status(201).json(application);
});

const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ userId: req.user._id })
    .populate("opportunityId")
    .sort({ createdAt: -1 });

  res.json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate("userId opportunityId");
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.opportunityId.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owning NGO can update this application");
  }

  application.status = req.body.status;
  if (typeof req.body.volunteerHours === "number") {
    application.volunteerHours = req.body.volunteerHours;
  }
  await application.save();

  if (req.body.status === "approved" && application.volunteerHours > 0) {
    await User.findByIdAndUpdate(application.userId._id, {
      $inc: { volunteerHours: application.volunteerHours }
    });
  }

  res.json(application);
});

module.exports = { applyToOpportunity, getMyApplications, updateApplicationStatus };

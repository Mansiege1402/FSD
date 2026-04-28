const Campaign = require("../models/Campaign");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getCampaigns = asyncHandler(async (_req, res) => {
  const campaigns = await Campaign.find()
    .populate("createdBy", "name organizationName")
    .populate("collaborators", "name organizationName")
    .sort({ createdAt: -1 });
  res.json(campaigns);
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("createdBy", "name organizationName")
    .populate("collaborators", "name organizationName");

  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  res.json(campaign);
});

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(campaign);
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  if (campaign.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owning NGO can update this campaign");
  }

  Object.assign(campaign, req.body);
  await campaign.save();
  res.json(campaign);
});

module.exports = { getCampaigns, getCampaignById, createCampaign, updateCampaign };

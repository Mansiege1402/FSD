const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createDonation = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.body.campaign);
  if (!campaign) {
    throw new ApiError(404, "Campaign not found");
  }

  const donation = await Donation.create({ ...req.body, donor: req.user._id });
  campaign.raisedAmount += donation.amount;
  await campaign.save();

  res.status(201).json(donation);
});

const getDonations = asyncHandler(async (req, res) => {
  const filter = req.user.role === "Admin" ? {} : { donor: req.user._id };
  const donations = await Donation.find(filter)
    .populate("campaign", "title goalAmount raisedAmount")
    .populate("donor", "name email")
    .sort({ createdAt: -1 });

  res.json(donations);
});

module.exports = { createDonation, getDonations };

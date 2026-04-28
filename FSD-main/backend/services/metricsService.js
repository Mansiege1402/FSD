const User = require("../models/User");
const Application = require("../models/Application");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const NgoProfile = require("../models/NgoProfile");
const { ROLES } = require("../utils/roles");

const getPlatformMetrics = async () => {
  const [volunteers, ngos, applications, campaigns, donations, verifiedNgos] = await Promise.all([
    User.countDocuments({ role: { $in: [ROLES.VOLUNTEER, ROLES.USER] } }),
    User.countDocuments({ role: ROLES.NGO }),
    Application.countDocuments(),
    Campaign.countDocuments(),
    Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    NgoProfile.countDocuments({ verificationBadge: true })
  ]);

  return {
    volunteers,
    ngos,
    applications,
    campaigns,
    verifiedNgos,
    totalDonations: donations[0]?.total || 0
  };
};

module.exports = { getPlatformMetrics };

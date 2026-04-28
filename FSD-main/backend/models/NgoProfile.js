const mongoose = require("mongoose");

const ngoProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    mission: { type: String, default: "" },
    website: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verificationBadge: { type: Boolean, default: false },
    partnershipCount: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    focusAreas: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("NgoProfile", ngoProfileSchema);

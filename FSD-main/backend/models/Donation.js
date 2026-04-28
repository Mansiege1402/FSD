const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "USD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed"
    },
    message: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);

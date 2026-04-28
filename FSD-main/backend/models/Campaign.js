const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "active"
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sdgFocus: { type: String, default: "SDG 17" },
    communityImpact: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);

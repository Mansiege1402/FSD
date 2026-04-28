const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending"
    },
    note: { type: String, default: "" },
    volunteerHours: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

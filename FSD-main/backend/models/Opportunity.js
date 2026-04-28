const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, default: "Community" },
    capacity: { type: Number, default: 25, min: 1 },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "completed"],
      default: "open"
    },
    skillsRequired: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

opportunitySchema.index({ title: "text", description: "text", location: "text" });

module.exports = mongoose.model("Opportunity", opportunitySchema);

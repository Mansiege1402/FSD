const mongoose = require("mongoose");
const { ROLES } = require("../utils/roles");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    organizationName: { type: String, default: "" },
    skills: { type: [String], default: [] },
    causes: { type: [String], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    refreshTokens: { type: [String], default: [] },
    volunteerHours: { type: Number, default: 0 },
    partnerScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

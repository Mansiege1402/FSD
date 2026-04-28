const express = require("express");
const {
  getCurrentUser,
  getUsers,
  updateProfile,
  getAnalyticsOverview
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateProfile);
router.get("/analytics/overview", protect, authorizeRoles(ROLES.ADMIN), getAnalyticsOverview);
router.get("/", protect, authorizeRoles(ROLES.ADMIN), getUsers);

module.exports = router;
